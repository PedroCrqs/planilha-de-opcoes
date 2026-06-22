document.addEventListener("DOMContentLoaded", () => {
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
