window.onload = () => {
  alert(
    "Olá corretor parceiro! Você está acessando minha planilha de opções diretas atualizada. Ao clicar no nome de cada opção, você será redirecionado para uma pasta no drive contendo as fotos e a descrição de cada opção."
  );
};

const input = document.getElementById("search"); //capture the input element
const lines = document.querySelectorAll("#table tbody tr"); //capture all table rows in the tbody

// Add an event listener to the input element to filter table rows based on input
input.addEventListener("input", () => {
  const search = input.value.toLowerCase().replace(/[.,]/g, ""); // Get the input value, convert it to lowercase, and remove punctuation

  lines.forEach((line) => {
    const lineText = line.textContent.toLowerCase().replace(/[.,]/g, ""); //capture the text content of each line, convert it to lowercase, and remove punctuation
    line.classList.toggle("hide", !lineText.includes(search)); // Toggle the "hide" class based on whether the line text includes the search term
  });
});
