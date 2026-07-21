require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { google } = require("googleapis");

// Importa o Pool configurado no db.js
const { pool } = require("./public/src/scripts/db");

const auth = new google.auth.GoogleAuth({
  keyFile: "./planilha-de-opcoes-dbe8155b12ce.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = google.drive({ version: "v3", auth });

const fotosCache = new Map();

// Consulta SQL adaptada
const queryAvailable = `
  SELECT i.imovelid AS "ImovelID",
         c.nome AS "NomeImovel",
         b.nome AS "Bairro",
         i.valor AS "Valor",
         i.tipologia AS "Tipologia",
         i.quartos AS "Quartos",
         i.linkpublico AS "LinkPublico"
  FROM imoveis i
  INNER JOIN bairros b ON i.bairroid = b.bairroid
  LEFT JOIN condominios c ON i.condominioid = c.condominioid
  WHERE i.imovelstatus = 'Disponível'
  ORDER BY b.nome, c.nome
`;

app.use(express.static("public"));

app.get("/api/imoveis", async (req, res) => {
  try {
    const { rows } = await pool.query(queryAvailable);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar imóveis disponíveis:", err.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

function extractFolderId(link) {
  if (!link) return null;
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Tempo de vida do cache: 12 horas
const CACHE_TTL = 12 * 60 * 60 * 1000;

app.get("/api/imoveis/:id/fotos", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const now = Date.now();

  // Verifica se o item existe no cache e se ainda é válido
  if (fotosCache.has(id)) {
    const cachedItem = fotosCache.get(id);

    if (now - cachedItem.timestamp < CACHE_TTL) {
      return res.json(cachedItem.urls);
    } else {
      fotosCache.delete(id);
    }
  }

  try {
    // Consulta substituindo '?' por '$1' para o pg
    const queryFoto = `SELECT linkpublico AS "LinkPublico" FROM imoveis WHERE imovelid = $1`;
    const { rows } = await pool.query(queryFoto, [id]);
    const imovel = rows[0];

    const folderId = extractFolderId(imovel?.LinkPublico);

    if (!folderId) return res.json([]);

    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id, name)",
      orderBy: "name",
      pageSize: 100,
    });

    const urls = (data.files || []).map(
      (f) => `https://drive.google.com/thumbnail?id=${f.id}&sz=w1200`
    );

    fotosCache.set(id, {
      urls: urls,
      timestamp: now,
    });

    res.json(urls);
  } catch (err) {
    console.error(`Erro ao buscar fotos do imóvel ${id}:`, err.message);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
