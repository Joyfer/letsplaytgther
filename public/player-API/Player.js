let color = "";
let nombreUsuario = "";
let roomt = "";
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
  let modal = document.getElementById("myModal");
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
    (color == "list-group-item-primary" ||
      color == "list-group-item-success" ||
      color == "list-group-item-danger" ||
      color == "list-group-item-warning" ||
      color == "list-group-item-info") &&
    nombreUsuario.length < 10
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
  } else if (nombreUsuario.length >= 10) {
    crearAlerta("Nombre muy largo");
  }
  return;
});
// SearchEngine -----------------------------------------
const div = document.getElementById("lista");

const searchVideoYT = async (videoNombre) => {
  try {
    if((videoNombre.includes("=")) || (videoNombre.includes("/"))){
      let urlId = videoNombre
      socket.emit("url-player", urlId, roomt);
    }
    else {
    div.innerHTML = "";
    const resVideo = await axios(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=7&q=${videoNombre}&type=video&key=AIzaSyDob4dB6zKQ1m8CcZGCdvW6JTd3q2YkhTc`
    );
    for await (el of resVideo.data.items) {
      let video = document.createElement("li");
      video.classList.add(
        "list-group-item",
        "border-0",
        "align-items-center",
        "text-center",
        "justify-content-center"
      );
      video.innerHTML = `<img src="${el.snippet.thumbnails.high.url}"><br><button class="btn btn-warning mt-1" value="${el.id.videoId}">${el.snippet.title}</button><p>Autor: ${el.snippet.channelTitle}</p>`;
      div.appendChild(video);
      $("#modalSearches").modal("show");
    }
    }
  } catch (error) {
    console.log(error);
    crearAlerta("Lo siento, no podemos buscar, pon la url.");
  }
  return;
};
const buscarVideo = (event) => {
  event.preventDefault();
  let url = document.getElementById("n").value;
  searchVideoYT(url);
  return (document.getElementById("n").value = ""), (url = "");
};
div.addEventListener("click", function (e) {
  if (e.target && e.target.nodeName == "BUTTON") {
    let urlId = e.target.value;
    div.innerHTML = "";
    socket.emit("url-player", urlId, roomt);
    $("#modalSearches").modal("hide");
    socket.emit(
      "chat message",
      "¡Ha puesto un nuevo video!",
      "list-group-item-secondary",
      nombreUsuario,
      roomt
    );
    return (urldId = "");
  }
});

// Eventos ---------------------------------------------
document.getElementById("ola").addEventListener("submit", buscarVideo);
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
