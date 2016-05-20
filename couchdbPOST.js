var fs = require( 'fs' );
var path = require( 'path' );
var process = require( "process" );
var nano = require('nano')('http://localhost:5984');
var db_name = "curriculum_questions";
var db = nano.use(db_name);
var sourceDir = "C:/Users/Salsabeel/Documents/IoT course/Project/Populate database";
var i=0;

function insert_doc(doc, tried) {
db.insert(doc,
  function (error,http_body,http_headers) {
    if(error) {
      if(error.message === 'no_db_file'  && tried < 1) {
        // create database and retry
        return nano.db.create(db_name, function () {
          insert_doc(doc, tried+1);
        });
      }
      else { return console.log(error); }
    }
    console.log(http_body);
});
}
// Loop through all the files in the temp directory
fs.readdir( sourceDir, function( err, files ) {
        if( err ) {
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        } 
        files.forEach( function( file, index ) {
                var fromPath = path.join( sourceDir, file );
                fs.stat( fromPath, function( error, stat ) {
                    if( error ) {
                        console.error( "Error stating file.", error );
                        return;
                    }
                    if (path.extname(file)=='.json'){
                        var contents = fs.readFileSync(file);
                        var jsonContent = JSON.parse(contents);
                        insert_doc(contents, 0);
                    }
                } );
        } );
} );