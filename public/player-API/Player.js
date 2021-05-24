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
  $("#myModal").modal("hide");
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
    //Si se cumplen las condiciones para crear usuario
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
  let objDiv = document.querySelector("body");
  alertaDiv.innerHTML = `${errorA}  :(`;
  objDiv.appendChild(alertaDiv);
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
      let inicio = player.getCurrentTime();
      let duration = player.getDuration();
      socket.emit("min-player", Usuario.roomt, inicio, evento, duration);
      break;
  }
  evento = "";
  return;
}
// Funciones del chat
function enviarMensaje(event) {
  event.preventDefault(); // prevents page reloading
  let msg = document.getElementById("mensajeChat").value;
  if (msg.length < 150) {
    console.log(socket.connected);
    socket.emit(
      "chat message",
      msg,
      Usuario.color,
      Usuario.nombreUser,
      Usuario.roomt
    );
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
  if (objDiv.getElementsByTagName("li").length > 20) {
    objDiv.removeChild(objDiv.childNodes[0]);
  }
  let d = new Date();
  let hora = d.getHours();
  let minuto = d.getMinutes();
  msg = `${msg} -  ${hora}:${minuto}`;
  mensaje.innerText = msg;
  objDiv.appendChild(mensaje);
  objDiv.scrollTop = objDiv.scrollHeight;
  return;
}
// Buscador de Youtube -----------------------------------------
const div = document.getElementById("lista");
const searchVideoYT = async (videoNombre) => {
  try {
    if (videoNombre.includes("=") || videoNombre.includes("/")) {
      let urlId = videoNombre;
      socket.emit("url-player", urlId, Usuario.roomt);
      nuevoVidMsg();
    } else {
      div.innerHTML = "";
      const resVideo = await axios(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${videoNombre}&type=video&key=AIzaSyDob4dB6zKQ1m8CcZGCdvW6JTd3q2YkhTc`
      );
      for await (el of resVideo.data.items) {
        let video = document.createElement("li");
        video.classList.add(
          "list-group-item",
          "align-items-center",
          "text-center",
          "justify-content-center"
        );
        video.setAttribute("role", "button");
        video.setAttribute("onclick", `PonerVideoYoutube("${el.id.videoId}")`);
        video.innerHTML = `
        <img src="https://i.ytimg.com/vi/${el.id.videoId}/hqdefault.jpg" class="img-fluid">
        <br><button class="btn btn-warning mt-2">${el.snippet.title}</button><p>${el.snippet.channelTitle}<p>`;
        div.appendChild(video);
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
  let url = document.getElementById("n").value;
  if (url == "") {
    crearAlerta("Por favor coloque algo.");
  } else {
    searchVideoYT(url);
  }
  return (document.getElementById("n").value = ""), (url = "");
};
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
function PonerVideoYoutube(value) {
  let urlId = value;
  div.innerHTML = "";
  socket.emit("url-player", urlId, Usuario.roomt);
  $("#modalSearches").modal("hide");
  nuevoVidMsg();
}
// Eventos ---------------------------------------------
// Poner video de lista de Youtube ------------
div.addEventListener("click", PonerVideoYoutube);
// ---------------------------------------------------
document.getElementById("buscarVideo").addEventListener("submit", buscarVideo);
for (let el of controlsButtons) el.addEventListener("click", controles);
document.getElementById("chat").addEventListener("submit", enviarMensaje);
reconnectButton.addEventListener("click", () => {
  connect("Se ha reconectado");
});
// Sockets ----------------------------------------------
socket.on("play-player", playVideo);
socket.on("pause-player", pauseVideo);
socket.on("min-player", seekTo);
socket.on("url-player", loadVideo);
socket.on("chat message", chatMensajes);
