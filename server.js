const express = require("express");
const app = express();
const PORT = 3000;
const Database = require("better-sqlite3");
const { google } = require("googleapis");

const db = new Database("../imoveis-database/data/imoveis.db");

const auth = new google.auth.GoogleAuth({
  keyFile: "./planilha-de-opcoes-dbe8155b12ce.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = google.drive({ version: "v3", auth });

const fotosCache = new Map();

const query = `
  SELECT i.ImovelID,
  c.Nome AS NomeImovel,
  b.Nome AS Bairro,
  i.Valor,
  i.Tipologia,
  i.Quartos,
  i.LinkPublico
  FROM Imoveis i
  INNER JOIN Bairros b ON i.BairroID = b.BairroID
  LEFT JOIN Condominios c ON i.CondominioID = c.CondominioID
  WHERE i.ImovelStatus = 'Disponível'
  ORDER BY b.Nome, c.Nome
`;
const available = db.prepare(query);

app.use(express.static("public"));

app.get("/api/imoveis", (req, res) => {
  res.json(available.all());
});

function extractFolderId(link) {
  if (!link) return null;
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

const stmtFoto = db.prepare(
  "SELECT LinkPublico FROM Imoveis WHERE ImovelID = ?",
);

// Define o tempo de vida do cache: 12 horas em milissegundos
// 12 horas * 60 minutos * 60 segundos * 1000 milissegundos
const CACHE_TTL = 12 * 60 * 60 * 1000;

app.get("/api/imoveis/:id/fotos", async (req, res) => {
  const id = Number(req.params.id);
  const imovel = stmtFoto.get(id);
  const folderId = extractFolderId(imovel?.LinkPublico);

  if (!folderId) return res.json([]);

  const now = Date.now();

  // Verifica se o item existe no cache e se ainda é válido
  if (fotosCache.has(id)) {
    const cachedItem = fotosCache.get(id);

    if (now - cachedItem.timestamp < CACHE_TTL) {
      // Cache válido! Retorna direto da memória
      return res.json(cachedItem.urls);
    } else {
      // Cache expirou! Remove o item antigo do Map
      fotosCache.delete(id);
    }
  }

  try {
    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id, name)",
      orderBy: "name",
      pageSize: 20,
    });

    const urls = (data.files || []).map(
      (f) => `https://drive.google.com/thumbnail?id=${f.id}&sz=w1200`,
    );

    // Salva no cache a lista de urls acompanhada do timestamp atual
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
