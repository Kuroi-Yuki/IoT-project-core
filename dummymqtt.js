console.log('******************************************************************************');
console.log('************************STUDENT PUBLISHER HERE********************************');
console.log('******************************************************************************');
var mqtt = require("mqtt")

client = mqtt.connect("mqtt://localhost:1883");

var body='{"username":"14000038","qID":"1_2_4_1_3_1_ITEM_1767314fae7d45262a277ce0d051ff9f","state":"correct","context":{"light":"110","heat":"114","shaking":"55","alt":"77.3445","lon":"38.38748734"},"timestamp":"3874283749","duration":"73"}';

client.on("connect", function () {
	console.log("connected");
	client.publish("newAttempt", body);
	console.log('published '+body.toString());
});


/*
var mqtt = require('mqtt')

client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
	console.log("connected");
 	client.subscribe('realTimeAnalysis');
});
 
client.on('message', function (topic, message) {
  console.log(message);
  //client.end();
});*/

/*function subscribe(subscribingtopic){
	client.subscribe(subscribingtopic);
	client.on('message', function (topic, message) {
		fs.writeFile('new.pdf',  message, function(err) {
	  	if (err) throw err;
	  		console.log('It is saved!');
	  	});
	});

});*/