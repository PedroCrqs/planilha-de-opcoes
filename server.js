const express = require("express");
const app = express();
const PORT = 3000;
const Database = require("better-sqlite3");
const db = new Database("../imoveis-database/data/imoveis.db");

const query = `
  SELECT i.ImovelID,
  c.Nome AS NomeImovel,
  b.Nome AS Bairro,
  i.Valor,
  i.Tipologia,
  i.Quartos,
  i.LinkPublico
  FROM Imoveis i INNER JOIN Bairros b ON i.BairroID = b.BairroID LEFT JOIN Condominios c ON i.CondominioID = c.CondominioID WHERE i.ImovelStatus = 'Disponível' ORDER BY b.Nome, c.Nome
`;
const available = db.prepare(query).all();

app.use(express.static("public"));

app.get("/api/imoveis", (req, res) => {
  res.json(available);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
