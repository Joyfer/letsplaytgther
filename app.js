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

app.use('/chat', require('./router/chat'))
io.on('connection', (socket) => {

    socket.on('chat message', (msg) => {
        let now = new Date();
        io.emit('chat message', msg + ' - ' + now.getHours() + ':' + now.getMinutes());
    });
});



http.listen(PORT, () => {
    console.log('listening on *:3000');
});