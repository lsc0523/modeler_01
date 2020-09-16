
var sql = require("mssql"); 
//var convert = require('xml-js');
var dateFormat = require('dateformat');

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
});


var ModeltableName = "PROCESSMODEL"; 
var now = new Date();
 
//sql Qurey
var sqlSelectModelQurey = 'select * from ' + ModeltableName + ' where MODELID=@id' ; 
var sqlUpdateModelQuery = 'update ' + ModeltableName + ' set MODEL_XML=@XML where MODELID=@id';
var sqlDeleteModelQuery = 'delete from ' + ModeltableName + ' where MODELID=@id';
var sqlInsertModelQuery = 'insert into ' + ModeltableName +'(MODELCATID, MODELID, PROCESSID, MODEL_XML, INSUSER, INSDTTM, UPDUSER, UPDDTTM)'
						 + ' values (@MODELCATID, @MODELID, @PROCESSID, @MODEL_XML, @INSUSER, @INSDTTM, @UPDUSER, @UPDDTTM)';
var sqlSelectModelIDQurey = 'select top(1) MODELID from ' + ModeltableName + ' where (convert(varchar(8), INSDTTM, 112) = convert(varchar(8), getdate(), 112))' + ' order by (MODELID) DESC' 
 
function ExcuteSQLSelectByModelID(id, callback)
 {	 
	 var connection = sql.connect(dbConnectionConfig, function(err) {		 		 
		 if (err) {
			 return console.error('error is', err);
			 }
		 
		 var ps = new sql.PreparedStatement(connection);	     
		 ps.input('id', sql.NVarChar(50));
	 
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

function ExcuteSQLSelectByModelIDPromises(id, callback) {

		sql.connect(dbConnectionConfig).then(pool => {
			// Query		    
			return pool.request()
				.input('id', sql.NVarChar, id)
				.query(sqlSelectModelQurey)

		}).then(result => {
			// console.dir(result);¤·
			return callback(result);
		}).catch(err => {
			console.dir(err);
			// ... error checks
		})
}
 
function getNewModelID(callback)
 { 	 
	
	 	ExecuteNonQuery(sqlSelectModelIDQurey,function(result){
	 	if (result.rowsAffected != 0)
 		{
		 	//console.log(result);
			var data = result.recordset[0].MODELID;
			
			var temp = data.split('_');
			
			//console.log(temp);
			
			var cnt = temp[0].substring(0,7);
			cnt = temp[0].split('MOD');
 		}
	 	else	 		
 		{
 			var cnt = '00001'
 		}
		
		var zero5 = new Padder(5);		
		var newcnt = zero5.pad(Number(cnt[1])+1);
		var day = dateFormat(now, "yyyymmdd-hhMMss");
		var newID = "MOD" + newcnt + '_' + day;	
		
		console.log(newID);
		
		return callback(newID);
		
	 });
	 	
	 	//return callback(newModelID);
	//	return  callback();

 }
 
 
//  Number.prototype.padLeft = function (n,str){
//	    return Array(n-String(this).length+1).join(str||'0')+this;
//	}
function Padder(len, pad) {
	  if (len === undefined) {
	    len = 1;
	  } else if (pad === undefined) {
	    pad = '0';
	  }

	  var pads = '';
	  while (pads.length < len) {
	    pads += pad;
	  }

	  this.pad = function (what) {
	    var s = what.toString();
	    return pads.substring(0, pads.length - s.length) + s;
	  };
	}
  
function ExcuteSQLUpdateModel(xml, id, callback) 
 { 	 
	 var connection = sql.connect(dbConnectionConfig, function(err) {		 		 
		 if (err) {
			 return console.error('error is', err);
			 }
		 
		 var ps = new sql.PreparedStatement(connection);	     
		 ps.input('XML', sql.Xml);
		 ps.input('id', sql.NVarChar);	
		 
		 // Xml TO Json
//		 var xmlToJson = convert.xml2json(XML, {compact: true, spaces: 4});
//		 console.log(xmlToJson);
		 
		 ps.prepare(sqlUpdateModelQuery, function(err) {
	            ps.execute({XML:xml, id:id}, function(err, result) {
	                ps.unprepare(function (err) {
	                	if (err !== null){
	                		console.log(err);
	                	}
				   });
	                return callback(result);
	            });
		 });
	 });
 }

function ExcuteSQLUpdateModelbyPromises(xml, id, callback) {

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('XML', sql.Xml, xml)
			.input('id', sql.NVarChar, id)
			.query('update PROCESSMODEL set MODEL_XML=@XML where MODELID=@id')
	}).then(result => {
		console.dir(result);
		return callback(result.rowsAffected);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	});
}
 
function ExcuteSQLInsertModel(parms, callback) 
 { 	 
	// console.log(parms);
	 var connection = sql.connect(dbConnectionConfig, function(err) {		 		 
		 if (err) {
			 return console.error('error is', err);
			 }
		 
		 var ps = new sql.PreparedStatement(connection);	     
			 ps.input('MODELCATID', sql.NVarChar);
			 ps.input('MODELID', sql.NVarChar);
			 ps.input('PROCESSID', sql.NVarChar);
			 ps.input('MODEL_XML', sql.Xml);
			 ps.input('INSUSER', sql.NVarChar);
			 ps.input('INSDTTM', sql.DateTimeOffset);
			 ps.input('UPDUSER', sql.NVarChar);
			 ps.input('UPDDTTM', sql.DateTimeOffset);
			 ps.input('REPOSIGRUPID', sql.NVarChar);
	
	
			 getNewModelID(function(result){
				 console.log(result);
			 });
			 
			 
				 ps.prepare(sqlUpdateModelQuery, function(err) {
			            ps.execute({MODELCATID:parms.MODELCATID, MODELID:result, PROCESSID:parms.PROCESSID, MODEL_XML:parms.MODEL_XML,
			            			INSUSER:parms.INSUSER,INSDTTM:now,UPDUSER:parms.UPDUSER,UPDDTTM:now,REPOSIGRUPID:''}, function(err, result) {
			                ps.unprepare(function (err) {
			                	if (err !== null){
			                		console.log(err);
			                	}
						   });
			                return callback(result);
			            });
				 });
				 
			
			 
		// parms.MODELID = getNewModelID();

		// console.log(parms.MODELID);
	 

	 });
 }
 
function ExcuteSQLInsertModelbyPromises(parms, callback)
 {   	 
	 getNewModelID(function(result){
//	 console.log(result);    
		 sql.connect(dbConnectionConfig).then(pool => {
			    // Query		    
			    return pool.request()
			 .input('MODELCATID', sql.NVarChar, parms.MODELCATID)
			 .input('MODELID', sql.NVarChar, result)
			 .input('PROCESSID', sql.NVarChar, parms.PROCESSID)
			 .input('MODEL_XML', sql.Xml, parms.MODEL_XML)
			 .input('INSUSER', sql.NVarChar, parms.INSUSER)
			 .input('INSDTTM', sql.DateTimeOffset, now)
			 .input('UPDUSER', sql.NVarChar, parms.UPDUSER)
			 .input('UPDDTTM', sql.DateTimeOffset, now) 	
	         .query(sqlInsertModelQuery)            
	         
			}).then(result => {
			   // console.dir(result);
			    return callback(result);
			}).catch(err => {
				console.dir(err);
			  // ... error checks
			});
	    });
 } 

function ExcuteSQLDeleteModelbyPromises(id, callback) {

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('id', sql.NVarChar, id)
			.query(sqlDeleteModelQuery)
	}).then(result => {
		console.dir(result);
		return callback(result.rowsAffected);
	}).catch(err => {
		console.dir(err);
		// ... error checks
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
	NonQuery : ExecuteNonQuery,
	SelectModel: ExcuteSQLSelectByModelIDPromises,
	UpdateModel : ExcuteSQLUpdateModelbyPromises,
	InsertModel : ExcuteSQLInsertModelbyPromises,
	DeleteModel: ExcuteSQLDeleteModelbyPromises

};