var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var messages = [];
var sercetPassword = 123;
var clients = {};
var ws = new WebSocketServer({
  port: port
})

function getClientBySocket(socket) {

  for (var key in clients) {
    var client = clients[key];

    if (client.socket == socket) {
      return client;
    }
  }

  return null;
}



ws.on('connection', function(socket) {

  var client = {
    id: Math.random(),
    passwordVerified: false,
    socket: socket,
    isAlive: true
  }

  console.log('client ' + client.id + ' connection established');
  clients[client.id] = client;

  socket.on('message', function(data) {
    console.log('message received: ' + data + ' from socket ' + socket);

    var curClient = getClientBySocket(socket);

    var curPasswordVerified = curClient.passwordVerified;

    verifyClient(curClient, data);

    if (curClient.passwordVerified == true) {

      messages.push(data);

      if (curPasswordVerified != curClient.passwordVerified) {
        messages.forEach(function(msg) {
          curClient.socket.send(msg)
          console.log('message received: ' + data);
        })
      }

      for (var key in clients) {
        var client = clients[key];
        console.log('this ' + typeof(socket));

        if (client.passwordVerified == true) {
          if (client != curClient) {
            client.socket.send(data);
          }
        }
      }
    }
  });
})

function verifyClient(client, data) {

  if (data == sercetPassword) {
    client.passwordVerified = true;
  }

}



console.log('websockets server started');
