var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var mime = require('mime');
var wss = require('./websockets-server');



var server = http.createServer(function(req, res){

  console.log('Responding to request');

  var filePath = extract(req.url);

  var contentType = mime.getType(filePath);

  fs.readFile(filePath, function(err, data){

    if(err){
      handleError(err, res);
    }else{
      res.setHeader('Content-Type', contentType)
      res.end(data);
    }
  });
});

var handleError = function(err, res){

  var errfileName = 'app/notFound.html';

  console.log('The error fileName is: ' + errfileName);

  var contentType = mime.getType(errfileName);

  fs.readFile(errfileName, function(err, data){
    res.statusCode = 404;
    res.setHeader('Content-Type', contentType)
    res.end(data);
  })

}


server.listen(3000);
