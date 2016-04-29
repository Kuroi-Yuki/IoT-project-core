console.log('******************************************************************************');
console.log('***************************NODEJS SERVER HERE*********************************');
console.log('******************************************************************************');
var http=require('http');
var nano = require('nano')('http://localhost:5984');
var mqtt = require('mqtt');
var json2csv = require('json2csv');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var CSV = require('csv-string');
var path = require('path');
var mime = require('mime');
var Buffer = require('Buffer');
var _ = require('underscore');
var bodyParser = require('body-parser')

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var customParser = bodyParser.raw({ type: 'application/vnd.custom-type' });

//databases
var reports = nano.use ('reports');// not needed
var analysis = nano.use('analysis');
var topics = nano.use('topics');// probably not needed
var records = nano.use('records');
var curriculum = nano.use('curriculum');
var curriculum_questions = nano.use('curriculum_questions');

//mqtt client
client = mqtt.connect('mqtt://localhost:1883');
client.on('connect', function () {
	console.log("connected");
	subscribe(subscribingtopic);
	//publish(publishingtopic,'sample.pdf');
});

//var subscribingtopic='reports';
var subscribingtopic='newAttempt';
var publishingtopic='realTimeAnalysis';
var recordsCSV='default.csv';
var oldRecordsCSV='default.csv';

//********************************************************SERVER SETUP*************************************************************************
app.get('/', function (req, res) {
	console.log("Got a GET request for the homepage");
	getRecordsAsCSV(function(callback){
		var file = __dirname + '/'+ callback;
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);

		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);

		var filestream = fs.createReadStream(file);
		filestream.pipe(res);
	});
});

//app.use(getQuestions);

function getQuestions(req,res,next){
	pull_questionsByLO(req.params.tagId,function(arr){
		res.send(arr);
	})
}

app.get('/q/:tagId',getQuestions, function(req, res) {
});

app.get('/notify', function (req, res) {
	//getPDF(funtion(cb){
		//publish(publishingtopic,cb);
	//});
	publish(publishingtopic,'sample.pdf');
	res.send('ok thanx!');
});

var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;
});


//********************************************************DO THINGS*************************************************************************
//subscribe(subscribingtopic);

//var body={"id":"10004","score":"9.5","location":"67:34:4","motion":"590","temperature":"45","timestamp":"16:45","interval":"0h:6m:30s","relativelocation":"4"};

//insert_report(body,0);
//readPDF('sample.pdf');
//publish(publishingtopic,'sample.pdf');

//getRecordsAsCSV();
/*pull_questionIDs(function(body){
	body.rows.forEach(function(doc) {
		console.log(doc.value.join('.')+'.'+doc.key);
	});
	
});*/
//fixFields();

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
function pull_reports(cb) {
	reports.view('doc', 'get_all', function(err, body) {
		if (!err) {
			cb(body);
		}
		else
			console.log(err);
	});
}

function pull_singleRecord(id, cb) {
	records.view('doc', 'get_all', function(err, body) {
		if (!err) {
			body.rows.forEach(function(doc) {
				if (doc.key==id){
					cb(doc.value);
				}
			});
		}
		else
			console.log(err);
	});
}

function pull_records(cb) {
	records.view('doc', 'get_all', function(err, body) {
		if (!err) {
			cb(body);
		}
		else
			console.log(err);
	});
}

function pull_questionIDs(cb) {
	curriculum_questions.view('doc', 'get_byID', function(err, body) {
		if (!err) {
			cb(body);
		}
		else
			console.log(err);
	});
}

function pull_questionsByLO(path, cb) {
	curriculum_questions.view('doc', 'get_all', function(err, body) {
		var arr={"questions":[]};
		if (!err) {
			count=0;
			all=body.rows.length;
			body.rows.forEach(function(doc) {
				if (doc.key.join('_')==path){
					arr.questions.push(doc.value);
				}
				count++;
				if(count >= all)
					cb(arr);
			});
		}
		else
			console.log(err);
	});
}
//******************************************************DATABASE UPDATE*******************************************************************
records.update = function(obj, key, callback){
	var db = this;
	db.get(key, function (error, existing){
		if(!error){
			obj._rev = existing._rev;
		}
		db.insert(obj, key, callback); });
}

//***********************************************************CONVERT JSON TO CSV*************************************************************
function toCSV(entry, fields, fb){
	json2csv({ data: entry, fields: fields, hasCSVColumnTitle:false }, function(err, csv) {
		if (!err) {
			fb(csv);
		}
	});
}
//******************************************************GET ANALYSIS FROM R******************************************************************
function notifyR(){
	var getoptions = {
		host: 'localhost',
		port: 9456,
		method: 'GET'
	};
	var req = http.get(getoptions, function(res) {
		console.log("GETing NodeJS->R");
	});
	req.on('error', function(e) {
		console.log('ERROR: ' + e.message);
	});
}

function getPDF(cb){
	var getoptions = {
		host: 'localhost',
		port: 9456,
		method: 'GET',
		headers: {
			'Content-Type': 'application/pdf'
		}
	};
	var req = http.get(getoptions, function(res) {
		fs.writeFile('new.pdf',  res.body, function(err) {
			if (err) throw err;
			console.log('It is saved!');
			cb(res.body);
		});
	});
	req.on('error', function(e) {
		console.log('ERROR: ' + e.message);
	});
}

//****************************************************PUBLISH TO TEACHERS******************************************************************
function getRecordsAsCSV(callback){
	//create new records.csv
	var d= new Date();
	oldRecordsCSV=recordsCSV;
	recordsCSV='record'+d.getTime()+'.csv';

	//report column titles
	var fieldnames = ['User.ID','Grade','Status','Section','Course','Teacher.ID',
	'School','Cluster','Tehsil','Distt.','Gender','EMIS.Code','LBNB','CTSC.EMIS.ID',
	'CTSC.NAME','G.II.Enrollment','G.V.Enrollment','LATITUDE','LONGTITUDE'];

	var fields = [
	{
		label:'ID',
		value:'User.ID'
	},
	'Grade','Status','Section','Course',
	{
		label:'ID',
		value:'Teacher.ID'
	},
	'School','Cluster','Tehsil',
	{
		label:'Distt.',
		value:'Distt.[""]'
	},
	'Gender',
	{
		label:'Code',
		value:'EMIS.Code'
	},
	'LBNB',
	{
		label:'ID',
		value:'CTSC.EMIS.ID'
	},
	{
		label:'NAME',
		value:'CTSC.NAME'
	},
	{
		label:'Enrollment',
		value:'G.II.Enrollment'
	},
	{
		label:'Enrollment',
		value:'G.V.Enrollment'
	},
	'LATITUDE','LONGTITUDE'
	];

	var count=1;
	pull_questionIDs(function(body){
		body.rows.forEach(function(doc) {
			header={};
			var labelstring='label';
			header[labelstring]='state';
			var valuestring='value';
			header[valuestring]=doc.value.join('_')+'_'+doc.key+'.state';
			var defaultstring='default';
			header[defaultstring]='-';

			fields.push(header);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/state');

			header2={};
			header2[labelstring]='light';
			header2[valuestring]=doc.value.join('_')+'_'+doc.key+'.context.light';
			header2[defaultstring]='-';

			fields.push(header2);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/light');

			header3={};
			header3[labelstring]='heat';
			header3[valuestring]=doc.value.join('_')+'_'+doc.key+'.context.heat';
			header3[defaultstring]='-';

			fields.push(header3);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/heat');

			header4={};
			header4[labelstring]='shaking';
			header4[valuestring]=doc.value.join('_')+'_'+doc.key+'.context.shaking';
			header4[defaultstring]='-';

			fields.push(header4);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/shaking');

			header5={};
			header5[labelstring]='altitude';
			header5[valuestring]=doc.value.join('_')+'_'+doc.key+'.context.alt';
			header5[defaultstring]='-';

			fields.push(header5);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/altitude');

			header6={};
			header6[labelstring]='longitude';
			header6[valuestring]=doc.value.join('_')+'_'+doc.key+'.context.lon';
			header6[defaultstring]='-';

			fields.push(header6);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/longitude');

			header7={};
			header7[labelstring]='timestamp';
			header7[valuestring]=doc.value.join('_')+'_'+doc.key+'.timestamp';
			header7[defaultstring]='-';

			fields.push(header7);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/timestamp');

			header8={};
			header8[labelstring]='context';
			header8[valuestring]=doc.value.join('_')+'_'+doc.key+'.duration';
			header8[defaultstring]='-';

			fields.push(header8);
			fieldnames.push(doc.value.join('_')+'_'+doc.key+'/duration');
		});

		fs.writeFile(recordsCSV,fieldnames,function(){
			pull_records(function(body) {
				body.rows.forEach(function(doc) {
					toCSV(doc.value, fields, function(csv) {
						fs.appendFile(recordsCSV, '\r\n'+csv, function(err) {
						if (err) throw err;
						});
					});
				});
				callback(recordsCSV);
			});
		});
	});

    if (oldRecordsCSV!='default.csv'){
    	console.log('deleting ya old thang '+oldRecordsCSV);
    	var filePath = 'C:/Users/Salsabeel/Documents/IoT course/Project/'+oldRecordsCSV; 
    	fs.unlinkSync(filePath);
    }


}

//****************************************************PUBLISH TO TEACHERS******************************************************************
//publish to teachers
function publish(publishingtopic, filename){	
	readPDF(filename,function(cb){
		client.publish(publishingtopic, cb, function(err){
			if (!err) console.log('analysis published');
		});
	});
}

function subscribe(subscribingtopic){
	client.subscribe(subscribingtopic);
	client.on('message', function (topic, message) {
	var report = JSON.parse(message.toString());
	insert_report(report,0);
	var studentID = report.username;
	console.log('student id: '+studentID);
	pull_singleRecord(studentID, function(record){
		var recID=record._id;
		delete report.username;
		record[report.qID]=report;
		records.update(record, recID, function(err, res){
			if(!err){
				console.log(JSON.stringify(res));
			}
		});		
		notifyR();
		});
	});

}
//****************************************************TEST FUNCTIONS******************************************************************
function readPDF(filename, cb){
	fs.readFile(filename, function(err, data) {
		if (err) throw err;
		cb(data);
	});
}
/*		fs.writeFile('new.pdf',  message, function(err) {
		  if (err) throw err;
		  	console.log('It is saved!');
		  });*/
		//var extendedReport = _.extend(report,record);
		//console.log(JSON.stringify(extendedReport));
		//insert_report(extendedReport,0);
		//message=message.toString();
		//console.log(message.toString());
		//insert_report(JSON.parse(message),0);
		//appendNewToCSV(JSON.parse(message));
		//notifyR();
		//var buff=new Buffer(data);
		//var jsonized=buff.toJSON();
		/*		var strinfigied=JSON.stringify(data);*/
		//console.log('shortcut '+strinfigied);
		//console.log('JSON buffer '+strinfigied);
		//const buf6 = Buffer.from(data.toString(), 'utf8');

		//var a = JSON.parse(strinfigied);
/*		var buff = Buffer.from(strinfigied);
console.log('buffed again '+buff);*/

		/*fs.writeFile('new.pdf',  buff, function(err) {
		  if (err) throw err;
		  	console.log('It is saved!');
		  });*/
/*app.post('/login', urlencodedParser, function (req, res) {
	if (!req.body) return res.sendStatus(400)
		res.send('welcome, ' + req.body.username)
});

app.post('/', customParser, function (req, res) {
	if (!req.body) return res.sendStatus(400)
		fs.writeFile('new.pdf',  req.body, function(err) {
			if (err) throw err;
			console.log('It is saved!');
		});
	res.send('welcome!');
});*/

/*app.get('/asset', function(request, response){
  var tempFile="sample.pdf";
  fs.readFile(tempFile, function (err,data){
     response.contentType("application/pdf");
     response.send(data);
     console.log(data);
  });
});*/


/*	pull_questionsByLO(req.params.tagId,function(arr){
		res.send(arr);
	//console.log(JSON.stringify(arr));
	})*/
  //res.send("tagId is set to " + req.params.tagId);


/*app.get('/l', function(req, res) {
	pull_questionsByLO(req.query.tagId,function(arr){
		res.send(arr);
	//console.log(JSON.stringify(arr));
	})
  //res.send("tagId is set to " + req.query.tagId);
});*/