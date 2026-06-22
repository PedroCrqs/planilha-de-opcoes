document.addEventListener("DOMContentLoaded", async () => {
  alert(
    "Olá corretor parceiro! Você está acessando minha planilha de opções diretas atualizada. Ao clicar no nome de cada opção, você será redirecionado para uma pasta no drive contendo as fotos e a descrição de cada opção.",
  );

  await renderizeImoveis();

  const inputs = document.querySelectorAll("input[data-column]");

  function filterTable() {
    const lines = document.querySelectorAll("#table tbody tr");
    lines.forEach((line) => {
      let show = true;
      inputs.forEach((input) => {
        const colIdx = parseInt(input.getAttribute("data-column"));
        const search = input.value.trim().toLowerCase().replace(/[.,]/g, "");
        const cell = line.children[colIdx];
        if (search && cell) {
          const cellText = cell.textContent
            .trim()
            .toLowerCase()
            .replace(/[.,]/g, "");
          if (!cellText.includes(search)) show = false;
        }
      });
      line.classList.toggle("hide", !show);
    });
  }

  inputs.forEach((input) => {
    input.addEventListener("input", filterTable);
  });
});

async function fetchImoveis() {
  const response = await fetch("/api/imoveis");
  return response.json();
}

async function renderizeImoveis() {
  const imoveis = await fetchImoveis();
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  imoveis.forEach((imovel) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a class="bName" href="${imovel.LinkPublico}" target="_blank">${imovel.NomeImovel}</a></td>
      <td>${imovel.Bairro}</td>
      <td>${imovel.Valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
      <td>${imovel.Quartos}</td>
    `;
    tableBody.appendChild(row);
  });
}
