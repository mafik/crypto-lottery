var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport("sendmail");

app.listen(8080);

function validateEmail(email) { 
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
} 

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {

  socket.on('message', function (data) {

    if(JSON.stringify(data).length > 255) { // cheater
      socket.disconnect();
      console.error('Socket ' + socket.id + ', sent too much data');
      return;
    }

    var rooms = io.sockets.manager.roomClients[socket.id];
    for(var room in rooms) {
      if(room) break;
    }
    if(!room) return; // cheater
    room = room.substr(1);
    console.log("Socket " + socket.id + " sending message: " + JSON.stringify(data));
    data.source = socket.id;
    socket.broadcast.to(room).emit('message', data);
  });

  socket.on('disconnect', function() {
    var rooms = io.sockets.manager.roomClients[socket.id];
    for(var room in rooms) {
      if(room) break;
    }
    if(!room) return; // cheater
    room = room.substr(1);
    console.log('Socket ' + socket.id + ' leaving room ' + room);
    io.sockets.in(room).emit('leave', socket.id);
  });

  socket.on('invite', function(email) {
    if(!validateEmail(email)) { // legit mistake
      socket.emit('invalid-email');
      return;
    }
    var rooms = io.sockets.manager.roomClients[socket.id];
    for(var room in rooms) {
      if(room) break;
    }
    if(!room) { // cheater
      socket.disconnect();
      return;
    }
    var url = "https://mrogalski.eu/cl/#" + room;
    transport.sendMail({
      from: "Crypto Lottery <marek@mrogalski.eu>",
      to: email,
      subject: "Someone wants to securely draw lots with you",
      text: "In order to join, visit " + url + ".",
      html: "In order to join, visit <a href='" + url + "'>"+url+"</a>."
    });
    socket.emit('sent');
  });

  socket.on('join', function (room) {
    if(!(/^[0-9a-zA-Z+_]{3,64}$/.test('' + room))) { // cheater
      socket.disconnect();
      console.error('Socket ' + socket.id + ', tried bad url');
      return;
    }
    io.sockets.in(room).emit('join', socket.id);
    var others = io.sockets.manager.rooms['/' + room] || [];
    socket.emit('hello', { you: socket.id, others: others });
    socket.join(room);
    console.log('Socket ' + socket.id + ', joined room "' + room + '"');
  });
});
