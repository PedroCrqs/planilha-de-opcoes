document.addEventListener("DOMContentLoaded", () => {
  alert(
    "Olá corretor parceiro! Você está acessando minha planilha de opções diretas atualizada. Ao clicar no nome de cada opção, você será redirecionado para uma pasta no drive contendo as fotos e a descrição de cada opção."
  );

  const inputs = document.querySelectorAll("input[data-column]");
  const lines = document.querySelectorAll("#table tbody tr");

  function filterTable() {
    lines.forEach((line) => {
      let show = true;
      inputs.forEach((input) => {
        const colIdx = parseInt(input.getAttribute("data-column"));
        const search = input.value.trim().toLowerCase().replace(/[.,]/g, "");
        const cell = line.children[colIdx];
        if (search && cell) {
          const cellText = cell.textContent.trim().toLowerCase().replace(/[.,]/g, "");
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
