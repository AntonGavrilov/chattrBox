var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var messages = [];

var ws = new WebSocketServer({
  port: port
})


ws.on('connection', function(socket) {
  console.log('client connection established');
  messages.forEach(function(msg) {
    socket.send(msg);
  });
  socket.on('message', function(data) {
    console.log('message received: ' + data);

    messages.push(data);
    ws.clients.forEach(function(clientSocket) {
      clientSocket.send(data);
    });
    socket.send(data);
  });
})

console.log('websockets server started');
