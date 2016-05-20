console.log('******************************************************************************');
console.log('***************************TEACHER QUIZ HERE*********************************');
console.log('******************************************************************************');

var http = require('http');
var sleep = require('sleep');
var mqtt = require('mqtt');


var myrandom=Math.floor(Math.random()*(60-1) + 1);
console.log('sleeping for '+myrandom+'  seconds');

sleep.sleep(myrandom);

client = mqtt.connect('mqtt://localhost:1883');
client.on('connect', function () {
  console.log("connected");
  get();
});





function get(){
  var getoptions = {
      host: 'localhost',
      port: 8080,
      path: '/q/1_2_4_8_1_1',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  };
  var req = http.get(getoptions, function(res) {
    console.log("GETing");
    var bodyChunks = [];
    res.on('data', function(chunk) {
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      //console.log('http response: ' + body);
      client.publish("G2",JSON.stringify(body),function(){
        console.log('ok published!');
        client.end();
      });
    });
  });
  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
   });
}