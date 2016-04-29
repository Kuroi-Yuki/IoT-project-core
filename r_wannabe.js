var http=require('http');
var express = require('express');
var sleep = require('sleep');
var fs = require('fs');

var app = express();

app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('ok thanx!');
   sleep.sleep(10);
   interested();
});


var server = app.listen(9456, function () {
  var host = server.address().address;
  var port = server.address().port;
});

function interested(){
  var getoptions = {
      host: 'localhost',
      port: 8080,
      method: 'GET'
  };

  var req = http.get(getoptions, function(res) {
      console.log("GETing R->NodeJS");
      console.log(res);
/*      fs.writeFile('new.pdf',  message, function(err) {
      if (err) throw err;
        console.log('It is saved!');
    });*/
    });

  req.on('error', function(e) {
      console.log('ERROR: ' + e.message);
  });
}