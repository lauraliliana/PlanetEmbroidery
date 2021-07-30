// JavaScript Document
// Miguel Caicedo / Colombia /2020

/**
 * the scope it's the object in which the program is running
 * the arrow functions does not have scope
 **/



$(document).ready(() => {
  const realfile = document.getElementById("real-file");
  const boton = document.getElementById("addfile");
  const textoboton = document.getElementById("textboton");
  const formulario = document.getElementById("formulario");
  const submit = document.getElementById("submit");
  const requereds = [...formulario.children]
    .filter((element) => element.tagName != "BUTTON"
      && element.tagName != "SPAN"
      && element.tagName != "DIV"
      && element.hidden != true)

  let currentImage = String();

  boton.addEventListener("click", () => realfile.click());


  realfile.addEventListener("change", () => {
    if (realfile.files && realfile.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentImage = event?.target?.result
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
