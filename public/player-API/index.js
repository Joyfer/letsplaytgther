function crearAlerta(errorA) {
  let alertaDiv = document.createElement("div");
  alertaDiv.classList.add(
    "alert",
    "alert-danger",
    "fade",
    "show",
    "text-center"
  );
  alertaDiv.setAttribute("role", "alert");
  let objDiv = document.querySelector("body");
  alertaDiv.innerHTML = `${errorA} :(`;
  objDiv.appendChild(alertaDiv);
  setTimeout(function () {
    $('[role="alert"]').alert("close");
  }, 5000);
  return;
}
//Modal bootstrap 4.5 Jquery
$(".about").on("click", function () {
  $("#aboutModal").modal("show");
  return;
});
//Crear la sala
document.getElementById("linki").addEventListener("click", function (e) {
  let sala = document.getElementById("linkInput").value;
  sala = sala.replace(/\s/g, "");
  sala = sala.replace(/[^\w\s]/gi, "");
  if (sala != "" && sala.length < 10) {
    let url = "https://letsplaytgther.herokuapp.com/player/" + sala;
    window.location.href = url;
  } else if (sala.length > 10) {
    crearAlerta("El nombre excede el límite.");
  } else if (sala == "") {
    crearAlerta("Complete los campos.");
  } else {
    crearAlerta("No se pudo crear.");
  };
  return;
});
