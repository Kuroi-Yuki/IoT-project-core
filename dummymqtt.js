var mqtt = require("mqtt")

client = mqtt.connect("mqtt://localhost:1883");

var body='{"id":"10004","score":"9.5","location":"67:34:4","motion":"590","temperature":"45","timestamp":"16:45","interval":"0h:6m:30s","relativelocation":"4"}';

client.on("connect", function () {
	console.log("connected");
	client.publish("newEntries", body);
	console.log('published '+body.toString());
});



