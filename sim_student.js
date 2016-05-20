function client(){
	var mqtt=require('mqtt');
/*	var sleep=require('sleep');

	var myrandom=Math.floor(Math.random()*(60-1) + 1);

	sleep.sleep(myrandom);
	console.log('this quiz will take me '+myrandom+'  seconds');
*/
	var client = mqtt.connect('mqtt://localhost:1883');

	client.on('connect', function () {
		console.log("connected");
		var body='{"qID":"1_2_4_1_4_1_ITEM_f94a31fc26c5b11d330b296807b55237","questionID":"ITEM_f94a31fc26c5b11d330b296807b55237","status":"incorrect","username":"14000011","duration":4.601,"timestamp":"Fri May 06 2016 23:47:46 GMT+0400 (Arabian Standard Time)","context":{"light":10,"heatindex":100,"shaking":35,"alt":828732,"long":929239}}';
		var options={
			qos:1
		}
		client.publish('newAttempt',body,options, function(){
			console.log('done!');
			client.end();
		});
	});
}

function play(){
	console.log('******************************************************************************');
	console.log('******************************STUDENT HERE************************************');
	console.log('******************************************************************************');
}

var threadCount = 16; // play with the numbers here
jxcore.tasks.setThreadCount(threadCount);

var start_time;
var first_run = true;

jxcore.tasks.addTask(play);

jxcore.tasks.on('emptyQueue', function () {
    if (first_run) {
        first_run = false;
        start_time = Date.now();
        for (var i = 1; i <= 100; i++) {
            jxcore.tasks.addTask(client);
        }
    } else {
        console.log("Total time for", threadCount, "threads is", Date.now() - start_time, "ms");
    }
});


/*console.log('******************************************************************************');
console.log('******************************STUDENT HERE************************************');
console.log('******************************************************************************');

var mqtt = require('mqtt');
var sleep = require('sleep');

var myrandom=Math.floor(Math.random()*(60-1) + 1);
console.log('this quiz will take me '+myrandom+'  seconds');
sleep.sleep(myrandom);

client = mqtt.connect('mqtt://localhost:1883');
var body='{"qID":"1_2_4_1_4_1_ITEM_f94a31fc26c5b11d330b296807b55237","questionID":"ITEM_f94a31fc26c5b11d330b296807b55237","status":"incorrect","username":"14000037","duration":4.601,"timestamp":"Fri May 06 2016 23:47:46 GMT+0400 (Arabian Standard Time)","context":{"light":10,"heatindex":100,"shaking":35,"alt":828732,"long":929239}}';

client.on('connect', function () {
	console.log("connected");
	client.publish("newAttempt",body,function(){
		console.log('done!');
		client.end();
	});
});
*/

/*client.on('connect', function () {
	console.log("connected");
 	client.subscribe('G2');
});

var myrandom=Math.floor(Math.random()*(300-60) + 1);
console.log('this quiz will take me '+myrandom+'  seconds');

var body='{"qID":"1_2_4_1_4_1_ITEM_f94a31fc26c5b11d330b296807b55237","questionID":"ITEM_f94a31fc26c5b11d330b296807b55237","status":"incorrect","username":"14000011","duration":4.601,"timestamp":"Fri May 06 2016 23:47:46 GMT+0400 (Arabian Standard Time)","context":{"light":10,"heatindex":100,"shaking":35,"alt":828732,"long":929239}}';

client.on('message', function (topic, message) {
  console.log('ok got it!');
  sleep.sleep(myrandom);
  client.publish("newAttempt",body,function(){
  	  console.log('ok done!');
  	  client.end();
  	});

});*/