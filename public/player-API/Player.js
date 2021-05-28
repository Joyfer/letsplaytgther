class Usuarios {
  constructor(color, nombreUser, roomt) {
    this.color = color;
    this.nombreUser = nombreUser;
    this.roomt = roomt;
  }
}
let Usuario,
  reconnectButton = document.getElementById("reconnect");
const controlsButtons = document.getElementsByClassName("controls"),
  socket = io({ autoConnect: false, reconnection: false });
// Conect function
function connect(text) {
  socket.connect();
  socket.emit("join", Usuario.roomt);
  socket.emit(
    "chat message",
    `${text}`,
    "list-group-item-secondary",
    Usuario.nombreUser,
    Usuario.roomt
  );
}
socket.on("disconnect", () => {
  // Si se desconecta, corre la función connect
  connect("Se ha reconectado");
  return;
});
socket.on("play-player", playVideo);
socket.on("pause-player", pauseVideo);
socket.on("min-player", seekTo);
socket.on("url-player", loadVideo);
socket.on("chat message", chatMensajes);
// Modal -----------------------------
$(window).on("load", function () {
  $("#myModal").modal("show");
  return;
});
$("#guardarUsuario").click(function () {
  let nombreUsuario = document.getElementById("nombreUsuario").value;
  nombreUsuario = nombreUsuario.replace(/\s/g, "");
  let color = document.getElementById("colorUsuario").value;
  if (nombreUsuario == "") {
    crearAlerta("Completa los campos <3");
  } else if (
    (color == "list-group-item-primary" ||
      color == "list-group-item-success" ||
      color == "list-group-item-danger" ||
      color == "list-group-item-warning" ||
      color == "list-group-item-info") &&
    nombreUsuario.length < 10
  ) {
    //Si se cumplen las condiciones para crear un usuario
    //Creación de objeto Usuario
    Usuario = new Usuarios(color, nombreUsuario, salita);
    //Se oculta el modal
    $("#myModal").modal("hide");
    //Se conecta al SOcket y a la room
    connect("Se ha conectado");
    //Se activan los botones del chat
    reconnectButton.removeAttribute("disabled");
    for (el of controlsButtons) el.removeAttribute("disabled");
  } else if (nombreUsuario.length >= 10) {
    crearAlerta("Nombre muy largo");
  } else {
    crearAlerta("Error");
  }
  return;
});
// Alertas
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
  alertaDiv.innerHTML = `${errorA}  :(`;
  document.querySelector("body").appendChild(alertaDiv);
  setTimeout(function () {
    $('[role="alert"]').alert("close");
  }, 5000);
  return (alertaDiv = ""), (objDiv = "");
}
// Controles del reproductor
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
  playVideo();
  return;
}
function seekTo(amigo) {
  player.seekTo(amigo);
  return;
}
function controles(e) {
  const evento = e.target.getAttribute("id"),
    inicio = player.getCurrentTime(),
    duration = player.getDuration();
  switch (evento) {
    case "play-vid":
      socket.emit("play-player", Usuario.roomt);
      break;
    case "pause-vid":
      socket.emit("pause-player", Usuario.roomt);
      break;
    case "30segatras":
    case "30segadelante":
    case "reiniciar":
    case "final":
    case "syncnow":
      socket.emit("min-player", Usuario.roomt, inicio, evento, duration);
      break;
  }
  return;
}
function PonerVideoYoutube(e) {
  if (e.target.hasAttribute("data-video-id")) {
    let urlId = e.target.getAttribute("data-video-id");
    lista.innerHTML = "";
    socket.emit("url-player", urlId, Usuario.roomt);
    $("#modalSearches").modal("hide");
    nuevoVidMsg();
  }
}
function nuevoVidMsg() {
  socket.emit(
    "chat message",
    "¡Ha puesto un nuevo video!",
    "list-group-item-secondary",
    Usuario.nombreUser,
    Usuario.roomt
  );
  return;
}
// Funciones del chat
function enviarMensaje(event) {
  event.preventDefault(); // prevents page reloading
  let msg = document.getElementById("mensajeChat");
  if (msg.value.length < 150) {
    socket.emit(
      "chat message",
      msg.value,
      Usuario.color,
      Usuario.nombreUser,
      Usuario.roomt
    );
    msg.value = "";
  } else {
    crearAlerta("Mensaje muy largo");
  }
  return;
}
function chatMensajes(msg, color) {
  let mensaje = document.createElement("li"),
    mensajes = document.getElementById("messages"),
    date = new Date();
  mensaje.classList.add("list-group-item", color);
  if (mensajes.getElementsByTagName("li").length > 20) {
    mensajes.removeChild(mensajes.childNodes[0]);
  }
  msg = `${msg} -  ${date.getHours()}:${date.getMinutes()}`;
  mensaje.innerText = msg;
  mensajes.appendChild(mensaje);
  mensajes.scrollTop = mensajes.scrollHeight;
  return;
}
// Buscador de Youtube -----------------------------------------
const lista = document.getElementById("lista");
const searchVideoYT = async (videoNombre) => {
  try {
    if (videoNombre.includes("=") || videoNombre.includes("/")) {
      let urlId = videoNombre;
      socket.emit("url-player", urlId, Usuario.roomt);
      nuevoVidMsg();
    } else {
      lista.innerHTML = "";
      const resVideo = await axios(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${videoNombre}&type=video&key=AIzaSyDob4dB6zKQ1m8CcZGCdvW6JTd3q2YkhTc`
      );
      for await (el of resVideo.data.items) {
        let video = document.createElement("li");
        video.classList.add("list-group-item", "text-center");
        video.setAttribute("role", "button");
        video.setAttribute("data-video-id", `${el.id.videoId}`);
        video.innerHTML = `
        <img src="https://i.ytimg.com/vi/${el.id.videoId}/hqdefault.jpg" class="img-fluid">
        <br><button class="btn btn-warning mt-2">${el.snippet.title}</button><p>${el.snippet.channelTitle}<p>`;
        lista.appendChild(video);
        $("#modalSearches").modal("show");
      }
    }
  } catch (error) {
    crearAlerta("Lo siento, no podemos buscar, pon la url.");
  }
  return;
};
const buscarVideo = (event) => {
  event.preventDefault();
  let url = document.getElementById("searchInput");
  if (url.value == "") {
    crearAlerta("Por favor coloque algo.");
  } else {
    searchVideoYT(url.value);
  }
  return (url.value = "");
};
// Listeners ---------------------------------------------
// Poner video de lista de Youtube ------------
lista.addEventListener("click", PonerVideoYoutube);
// ---------------------------------------------------
document.getElementById("buscarVideo").addEventListener("submit", buscarVideo);
for (let el of controlsButtons) el.addEventListener("click", controles);
document.getElementById("chat").addEventListener("submit", enviarMensaje);
document.getElementById("lista").addEventListener("click", PonerVideoYoutube);
reconnectButton.addEventListener("click", () => {
  connect("Se ha reconectado");
});
