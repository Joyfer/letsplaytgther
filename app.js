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

//   ----------- Chat ----------
app.use('/chat', require('./router/chat'))
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        let now = new Date();
        io.emit('chat message', msg + ' - ' + now.getHours() + ':' + now.getMinutes());
    });
});
// ---------- Chat -------------

//   ----------- Video ----------
app.use('/player', require('./router/player'))
io.on('connection', (socket) => {
    socket.on('url-player', (url) => {
        io.emit('url-player', url);
    });
});
io.on('connection', (socket) => {
    socket.on('play-player', () => {
        io.emit('play-player');
    });
});
io.on('connection', (socket) => {
    socket.on('pause-player', () => {
        io.emit('pause-player');
    });
});
app.use('/player', require('./router/player'))
io.on('connection', (socket) => {
    socket.on('min-player', (amigo) => {
        io.emit('min-player', amigo);
    });
});

//   ----------- Video ----------
http.listen(PORT, () => {
    console.log('listening on *:3000');
});