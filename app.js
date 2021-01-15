const express = require('express')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.use('/chat', require('./router/chat'));


//   ----------- Video ----------
app.use('/player', require('./router/player'));

app.use(function(req, res, next) {
    res.status(404).render("404");
});

io.on('connection', (socket) => {


    socket.on('join', (roomt) => {
        socket.join(roomt);
    });

    socket.on('url-player', (url, roomt) => {
        let indexurl 
        let indexurlE
        if ((url.includes("="))){
             indexurl = url.indexOf("=");
             indexurlE = url.indexOf("&");
             url = url.substring((indexurl + 1), (indexurlE))
            } else if ((url.includes("/"))){
            indexurl = url.lastIndexOf("/");
            indexurlE = url.indexOf("&");
            url = url.substring((indexurl + 1), (indexurlE))}
        io.to(roomt).emit('url-player', url);
    });
    
    socket.on('play-player', (roomt) => {
        io.to(roomt).emit('play-player');
    });

    socket.on('pause-player', (roomt) => {
        io.to(roomt).emit('pause-player');
    });

    socket.on('min-player', ( roomt, inicio, evento, duration) => {
        if(evento == '30segatras'){
            var amigo = inicio - 30;
            } else if (evento == '30segadelante'){
            var amigo = inicio + 30;
            }else if (evento == 'reiniciar'){
            var amigo = 0;
            }else if (evento == 'final'){
            var amigo = duration - 1;
            }else if (evento == 'syncnow'){
            var amigo = inicio;
            }       
        io.to(roomt).emit('min-player', amigo);
    });
    socket.on('chat message', (msg, color, nombreUsuario, roomt) => {
        let mensaje = nombreUsuario + ": " + msg;
        io.to(roomt).emit('chat message', mensaje, color);
    });
    
});

//   ----------- Video ----------
http.listen(PORT, () => {
    console.log('listening on *:3000');
});