$(".about").on("click", function () {
  $("#aboutModal").modal("show");
  return;
});
document.getElementById("linki").addEventListener("click", function (e) {
  let sala = document.getElementById("nai").value;
  sala = sala.replace(/\s/g, "");
  sala = sala.replace(/[^\w\s]/gi, "");
  if (sala != "" && sala.length < 10) {
    let url = window.location.href + "player/" + sala;
    window.location.href = url;
  } else if (sala.length > 10) {
    crearAlerta("El nombre excede el límite.");
  } else if (sala == "") {
    crearAlerta("Complete los campos.");
  }
  return;
});
function crearAlerta(errorA) {
  let alertaDiv = document.createElement("div");
  alertaDiv.classList.add(
    "alert",
    "alert-primary",
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
