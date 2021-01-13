let color = "";
let nombreUsuario = "";
let roomt = "";
// Alertas
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
  alertaDiv.innerHTML = `${errorA}  :(`;
  objDiv.appendChild(alertaDiv);
  setTimeout(function () {
    $('[role="alert"]').alert("close");
  }, 5000);
  return (alertaDiv = ""), (objDiv = "");
}
// 4. Play and pause controlls
function playVideo() {
  player.playVideo();
  return;
}
function pauseVideo() {
  player.pauseVideo();
  return;
}
function loadVideo(url) {
  player.loadVideoById(url, 0);
  console.log(url);
  playVideo();
  return;
}
function seekTo(amigo) {
  player.seekTo(amigo);
  return;
}
function controles(e) {
  let evento = e.target.getAttribute("id");
  switch (evento) {
    case "play-vid":
      socket.emit("play-player", roomt);
      break;
    case "pause-vid":
      socket.emit("pause-player", roomt);
      break;
    case "30segatras":
    case "30segadelante":
    case "reiniciar":
    case "final":
    case "syncnow":
      let inicio = player.getCurrentTime();
      let duration = player.getDuration();
      socket.emit("min-player", roomt, inicio, evento, duration);
      break;
  }
  evento = "";
  return;
}
function urlForm(event) {
  event.preventDefault(); // prevents page reloading
  let url = document.getElementById("n").value;
  socket.emit("url-player", url, roomt);
  return (document.getElementById("n").value = ""), (url = "");
}
function enviarMensaje(event) {
  event.preventDefault(); // prevents page reloading
  let msg = document.getElementById("mensajeChat").value;
  if (msg.length < 150) {
    socket.emit("chat message", msg, color, nombreUsuario, roomt);
    document.getElementById("mensajeChat").value = "";
  } else {
    crearAlerta("Mensaje muy largo");
  }
  return;
}
function chatMensajes(msg, color) {
  let mensaje = document.createElement("li");
  mensaje.classList.add("list-group-item", color);
  let objDiv = document.getElementById("messages");
  let d = new Date();
  let hora = d.getHours();
  let minuto = d.getMinutes();
  msg = `${msg} -  ${hora}:${minuto}`;
  mensaje.innerText = msg;
  objDiv.appendChild(mensaje);
  objDiv.scrollTop = objDiv.scrollHeight;
  return;
}
// Modal -----------------------------
$(window).on("load", function () {
  $("#myModal").modal("show");
  return;
});
$("#guardarUsuario").click(function () {
  nombreUsuario = document.getElementById("nombreUsuario").value;
  nombreUsuario = nombreUsuario.replace(/\s/g, "");
  color = document.getElementById("colorUsuario").value;
  if (nombreUsuario == "") {
    crearAlerta("Completa los campos <3");
  } else if (
   ( color == "list-group-item-primary" ||
    color == "list-group-item-success" ||
    color == "list-group-item-danger" ||
    color == "list-group-item-warning" ||
    color == "list-group-item-info") && (nombreUsuario.length < 10)
  ) {
    roomt = salita;
    socket.emit("join", roomt);
    $("#myModal").modal("hide");
    socket.emit(
      "chat message",
      "¡Se ha unido a la sala!",
      "list-group-item-secondary",
      nombreUsuario,
      roomt
    );
  } else if (nombreUsuario.length >= 10){
    crearAlerta("Nombre muy largo");
  } 
  return;
});
// Eventos ---------------------------------------------
document.getElementById("ola").addEventListener("submit", urlForm);
const amor = document.getElementsByClassName("controls");
for (let el of amor) el.addEventListener("click", controles);
document.getElementById("chat").addEventListener("submit", enviarMensaje);
// Sockets ----------------------------------------------
const socket = io.connect();
socket.on("play-player", playVideo);
socket.on("pause-player", pauseVideo);
socket.on("min-player", seekTo);
socket.on("url-player", loadVideo);
socket.on("chat message", chatMensajes);
