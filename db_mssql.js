
var sql = require("mssql"); 

var dbConnectionConfig = { 
		 
		  database: "ProcessModelerDB",
		  options: {
		    enableArithAbort: true,
		    encrypt: false,
		  },
		  port: 1433,
		  user: 'sa',
		  password: "1", 
		  server: 'LCNC15V0516\\sqlexpress',
		}; 

sql.on('error', err => {
    // ... error handler
})


//function callbackTest(sqlQurey, callback)
//{
//	sql.connect(dbConnectionConfig, function(err) {
//	    var request = new sql.Request();
//	    request.query(sqlQurey, function(err, recordsets) {
//	    	  if(err){
//	    	      console.log(err);
//	    	      return;
//	    	  } else {	
//	    		  callback(recordsets);
//	    	  }	      	  
//	    });
//	});	
//
//}



 var ModeltableName = "PROCESSMODEL"; 
 var xmlColumn = 'MODEL_XML';

 var sqlSelectModelQurey = 'select * from ' + ModeltableName + ' where MODELID=@id' ; 
 var sqlUpdateModelQuery = 'update from ' + ModeltableName + ' set MODEL_XML=@XML where MODELID=@id';

 function ExcuteSQLSelectByModelID(id, callback)
 {	 
	 var connection = sql.connect(dbConnectionConfig, function(err) {		 		 
		 if (err) {
			 return console.error('error is', err);
			 }
		 
		 var ps = new sql.PreparedStatement(connection);	     
//		 ps.input('modelxml', sql.XML);
		 ps.input('id', sql.NVarChar(50));
		 
		 //console.log(sqlModelSelectQurey);		 
		 ps.prepare(sqlSelectModelQurey, function(err, recordsets) {		 
	            ps.execute({id:id} ,function (err, recordset) {
	                ps.unprepare(function (err) {
	                	if (err !== null){
	                		console.log(err);
	                	}
	                });
	                return callback(recordset);
	            });
		 });
	 });
 }
 
 function ExcuteSQLUpdateModel(XML, id, callback)
 {	 
	 var connection = sql.connect(dbConnectionConfig, function(err) {		 		 
		 if (err) {
			 return console.error('error is', err);
			 }
		 
		 var ps = new sql.PreparedStatement(connection);	     
		 ps.input('XML', sql.Xml, '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.1.1"></bpmn:definitions>');
		 ps.input('id', sql.NVarChar(50), id);
		 
		 console.log(sqlUpdateModelQuery);		 
		// console.log(ps.parameters);	
		// console.log(XML);

		 ps.prepare(sqlUpdateModelQuery, function(err, recordsets) {		 
	            ps.execute({XML:''},{id:id} ,function (err, recordset) {
	                ps.unprepare(function (err) {
	                	if (err !== null){
	                		console.log(err);
	                	}
	                });
	                console.log(recordset);
	                return callback(recordset);
	            });
		 });
	 });
 }
	 
 
function ExecuteNonQuery(sqlQurey, callback)
{
	sql.connect(dbConnectionConfig).then(pool => {
	    
		// Query	
		return pool.request().query(sqlQurey) 
		}).then(result => {
		//  console.dir(result);
			callback(result);	
		}).catch(err => {
			console.dir(err);
	})
}


 module.exports = {
		 ExecuteNonQuery : ExecuteNonQuery,
		 ExcuteSQLSelectByModelID : ExcuteSQLSelectByModelID,
		 ExcuteSQLUpdateModel : ExcuteSQLUpdateModel,
};

