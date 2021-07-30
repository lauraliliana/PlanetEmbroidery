// JavaScript Document
// Miguel Caicedo / Colombia /2020

/**
 * the scope it's the object in which the program is running
 * the arrow functions does not have scope
 **/

const filter_elements_no_requered = (element) => {
  return element.tagName != "BUTTON" && element.tagName != "SPAN"
    && element.tagName != "DIV" && element.hidden != true;
};
const imageElement = document.createElement("IMG");
const containerImage = document.createElement("FIGURE");
containerImage.appendChild(imageElement);
imageElement.setAttribute("style", "max-width: 200px;width: 50%;margin: auto;position: relative;");
containerImage.setAttribute("class", `image-render`);
$(document).ready(() => {
  const realfile = document.getElementById("real-file");
  const boton = document.getElementById("addfile");
  const textoboton = document.getElementById("textboton");
  const formulario = document.getElementById("formulario");
  const submit = document.getElementById("submit");
  const requereds = [...formulario.children].filter(filter_elements_no_requered);

  let currentFile = String();
  let currentType = String();


  boton.addEventListener("click", () => realfile.click());


  realfile.addEventListener("change", () => {
    if (realfile.files && realfile.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentFile = event?.target?.result;
        currentType = currentFile.split("/").shift().split(":").pop();
        if (currentType.includes("image"))
        {
          imageElement.setAttribute("src", currentFile);
          containerImage.setAttribute("style", `--src: url(${currentFile});display: initial;`);
          boton.insertAdjacentElement("afterend", containerImage);
        }
        else
        {
          containerImage.setAttribute("style", `--src: none;display: none;`);
        }
        console.log(currentType);
      };
      reader.readAsDataURL(realfile.files[0]);
    }
    if (realfile.value) textoboton.innerHTML = realfile.value.split("\\").pop();
    else textoboton.innerHTML = "No file chosen, yet.";
  });

  const url = "envioforma.php";

	submit.addEventListener("click", () => {
    if (![true, ...requereds].reduce((prev, current) => prev && current.value))
    {
      $("#resultado").html("<h4>Incomplete form</h4>")
      return;
    }
    submit.classList.add("peocess");
		const datosForm = new FormData(formulario);
		$.ajax({
			type: "post",
			url: url,
			data: datosForm,
      contentType: false,
      processData: false,
			success: function (data) {
        submit.classList.remove("peocess");
				$("#resultado").html(data);
			}
		});
	});

});
