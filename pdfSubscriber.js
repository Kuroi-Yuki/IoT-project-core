console.log('******************************************************************************');
console.log('***************************PDF SUBSCRIBER HERE********************************');
console.log('******************************************************************************');

var mqtt = require("mqtt")
var fs = require('fs');

client = mqtt.connect("mqtt://localhost:1883");


client.on('connect', function () {
	console.log("connected");
 	client.subscribe('realTimeAnalysis');
});
 
client.on('message', function (topic, message) {
	console.log(message);
	fs.writeFile('evennewer.pdf',  message, function(err) {
		if (err) throw err;
		console.log('It is saved!');
	});
});