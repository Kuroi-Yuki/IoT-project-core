console.log('******************************************************************************');
console.log('******************************TEACHER HERE************************************');
console.log('******************************************************************************');

var mqtt = require("mqtt")

client = mqtt.connect("mqtt://localhost:1883");
var i=0;

client.on('connect', function () {
	console.log("connected");
 	client.subscribe('realTimeAnalysis');
});
 
client.on('message', function (topic, message) {
	console.log('message no. '+ (++i));
});

/*
console.log('******************************************************************************');
console.log('************************TEACHER ANALYSIS HERE*********************************');
console.log('******************************************************************************');

var mqtt = require('mqtt')

client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
	console.log("connected");
	client.subscribe('realTimeAnalysis');
});

client.on('message', function (topic, message) {
  console.log('got a new analysis!');
});*/