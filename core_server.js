var http=require('http');
var nano = require('nano')('http://localhost:5984');
var mqtt = require('mqtt');
var json2csv = require('json2csv');
var fs = require('fs');

//databases
var reports = nano.use ('reports');// not needed
var analysis = nano.use('analysis');
var topics = nano.use('topics');// probably not needed

//mqtt client
client = mqtt.connect('mqtt://localhost:1883');
client.on('connect', function () {
	console.log("connected");
});

//report column titles
var fields = ['id', 'score', 'location', 'motion', 'temperature', 'timestamp', 'interval', 'relativelocation'];
var subscribingtopic='newEntries';
var publishingtopic='realTimeAnalysis';
var reportsCSV='reports.csv';

//********************************************************SERVER*************************************************************************
subscribe(subscribingtopic);

//*****************************************************DATABASE STORE********************************************************************
//store in database
function insert_report(doc, tried) {
	reports.insert(doc,
	  function (error,http_body,http_headers) {
	    if(error) {
	      if(error.message === 'no_db_file'  && tried < 1) {
	        return nano.db.create('reports', function () {
	          insert_report(doc, tried+1);
	        });
	      }
	      else { return console.log(error); }
	    }
	    console.log(http_body);
	});
}

function insert_topic(doc, tried) {
	topics.insert(doc,
	  function (error,http_body,http_headers) {
	    if(error) {
	      if(error.message === 'no_db_file'  && tried < 1) {
	        return nano.db.create('topics', function () {
	          insert_topic(doc, tried+1);
	        });
	      }
	      else { return console.log(error); }
	    }
	    console.log(http_body);
	});
}

function insert_analysis(doc, tried) {
	analysis.insert(doc,
	  function (error,http_body,http_headers) {
	    if(error) {
	      if(error.message === 'no_db_file'  && tried < 1) {
	        return nano.db.create('topics', function () {
	          insert_analysis(doc, tried+1);
	        });
	      }
	      else { return console.log(error); }
	    }
	    console.log(http_body);
	});
}


//******************************************************DATABASE PULL*******************************************************************
//pull all reports from database
function pull_reports() {
	reports.view('doc', 'get_all', function(err, body) {
		if (!err) {
			body.rows.forEach(function(doc) {  
				console.log(doc);
			}
			);
		}
		else
		console.log(err)
	});
}
//***********************************************************CONVERT JSON TO CSV*************************************************************
//convert JSONs to CSV
function appendNewToCSV(entry){
	json2csv({ data: entry, fields: fields, hasCSVColumnTitle:false }, function(err, csv) {
	  if (err) console.log(err);
	  fs.appendFile(reportsCSV, csv+'\r\n', function(err) {
	    if (err) throw err;
	    console.log('file saved');
	  });
	});
}
//******************************************************GET ANALYSIS FROM R******************************************************************
//send to R engine
function getAnalysis(){
	console.log('getting analysis');
	var getoptions = {
      host: 'localhost',
      port: 9456,
      path: '/resources/topic',
      method: 'GET',
      /*headers: {
          'Content-Type': 'application/json'
      }*/
	};
	var req = http.get(getoptions, function(res) {
	    console.log("GETing");
	    var bodyChunks = [];
	    res.on('data', function(chunk) {
	      bodyChunks.push(chunk);
	    }).on('end', function() {
	      var body = Buffer.concat(bodyChunks);
	      console.log('http response: ' + body);
	      publish(publishingtopic,body);
	    })
    });
    req.on('error', function(e) {
    	console.log('ERROR: ' + e.message);
	});
}

//****************************************************PUBLISH TO TEACHERS******************************************************************
//publish to teachers
function publish(publishingtopic, message){
    client.publish(publishingtopic, message, function(err){
    	if (!err) console.log('analysis published');
    });
}
function subscribe(subscribingtopic){
	client.subscribe(subscribingtopic);

	client.on('message', function (topic, message) {
		//message=message.toString();
		console.log(message.toString());
		//insert_report(message,0);
		appendNewToCSV(JSON.parse(message));
		getAnalysis();
	});
}
