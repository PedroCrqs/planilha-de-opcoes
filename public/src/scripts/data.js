function toTitleCase(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/(?:^\s*|\s+|[-–]\s*)(\w)/g, (match, char) =>
      match.replace(char, char.toUpperCase()),
    );
}

function deriveTipo(tipologia) {
  const map = {
    Casa: "casa",
    Cobertura: "cobertura",
    Studio: "studio",
    Apartamento: "apartamento",
  };
  return map[tipologia] || "apartamento";
}

function buildDisplayName(nomeImovel, tipologia) {
  const nome = toTitleCase(nomeImovel || "Imóvel sem nome");

  if (tipologia === "Casa") return `Casa - ${nome}`;
  if (tipologia === "Cobertura") return `Cobertura - ${nome}`;

  return nome;
}

async function fetchProperties() {
  const response = await fetch("/api/imoveis");

  if (!response.ok) {
    throw new Error(`Erro ao buscar imóveis: ${response.status}`);
  }

  const imoveis = await response.json();

  return imoveis.map((imovel, index) => ({
    id: imovel.ImovelID ?? index + 1,
    nome: buildDisplayName(imovel.NomeImovel, imovel.Tipologia),
    bairro: toTitleCase(imovel.Bairro),
    valor: imovel.Valor,
    tipo: deriveTipo(imovel.Tipologia),
    quartos: imovel.Quartos,
    link: imovel.LinkPublico || null,
    tipologia: `${imovel.Quartos} quarto${imovel.Quartos === 1 ? "" : "s"}`,
  }));
}
