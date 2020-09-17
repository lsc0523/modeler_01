
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
var ModelRepostableName = "PROCESSMODELREPOSITORY"; 
 

 
//sql Qurey
var sqlSelectModelQurey = 'select * from ' + ModeltableName + ' where MODELID=@id' ; 
var sqlUpdateModelQuery = 'update ' + ModeltableName + ' set MODEL_XML=@XML where MODELID=@id';

var sqlDeleteModelQuery = 'delete from ' + ModeltableName + ' where MODELID=@id';
var sqlInsertModelQuery = 'insert into ' + ModeltableName +'(MODELCATID, MODELID, PROCESSID, MODEL_XML, INSUSER, INSDTTM, UPDUSER, UPDDTTM)'
						 + ' values (@MODELCATID, @MODELID, @PROCESSID, @MODEL_XML, @INSUSER, @INSDTTM, @UPDUSER, @UPDDTTM)';
var sqlSelectModelIDQurey = 'select top(1) MODELID from ' + ModeltableName + ' where (convert(varchar(8), INSDTTM, 112) = convert(varchar(8), getdate(), 112))' + ' order by (MODELID) DESC'

var sqlSelectModelReposIDQurey = 'select top(1) REPOSID from ' + ModelRepostableName + ' where MODELID=@id order by (REPOSID) DESC'


var sqlInsertModelQuery_Dev = 'insert into ' + ModeltableName + '(MODELCATID, MODELTYPE, MODELID, MODELNAME, MODELDESC,  PROCESSID, MODEL_XML, MODELID_PR, MODELID_PR_NODEID, INSUSER, INSDTTM, UPDUSER, UPDDTTM)'
													+ ' values (@MODELCATID, @MODELTYPE, @MODELID, @MODELNAME, @MODELDESC, @PROCESSID, @MODEL_XML, @MODELID_PR, @MODELID_PR_NODEID, @INSUSER, @INSDTTM, @UPDUSER, @UPDDTTM)';

var sqlInsertModelReposQuery = 'insert into ' + ModelRepostableName + '(MODELID, REPOSID, MODEL_NODEID, REPOSNAME, REPOSINFO)'
														+ ' values (@MODELID, @REPOSID, @MODEL_NODEID, @REPOSNAME, @REPOSINFO)';
 
function ExcuteSQLSelectModel(id, callback)
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

function ExcuteSQLSelectModelbyPromises(id, callback) {

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

function ExcuteSQLSelectModelReposbyPromises(id, callback) {

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


 
function getNewReposID(id, callback)
 { 	 
	ExcuteSQLSelectModelReposbyPromises(id ,function(result){
			  if (result.rowsAffected != 0) {
				  console.log(result);
				  var data = result.recordset[0].REPOSID;
				  var cnt = data.substring('REPOS');
				  console.log(cnt);
			  }
			  else {
				  var cnt = '00001'
			  }	  


		var zero5 = new Padder(4);		
		var newcnt = zero5.pad(Number(cnt + 1));
		console.log(newcnt);
		var newID = "REPOS" + newcnt;	
		
		console.log(newID);
		
		return callback(newID);
		
	 });
	 	
	 	//return callback(newModelID);
	//	return  callback();

 }

function getNewModelID(callback) {
	ExecuteNonQuery(sqlSelectModelIDQurey, function (result) {
		if (result.rowsAffected != 0) {
			//console.log(result);
			var data = result.recordset[0].MODELID;

			var temp = data.split('_');

			//console.log(temp);

			var cnt = temp[0].substring(0, 7);
			cnt = temp[0].split('MOD');
		}
		else {
			var cnt = '00001'
		}

		var now = new Date();
		var zero5 = new Padder(5);
		var newcnt = zero5.pad(Number(cnt[1]) + 1);
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


// Model  
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

var sqlUpdateModelQuery_Dev = 'update ' + ModeltableName + ' set MODELNAME=@MODELNAME, MODELDESC=@MODELDESC, MODEL_XML=@MODEL_XML, @MODELID_PR, @MODELID_PR_NODEID, where MODELID=@id';

function ExcuteSQLUpdateModelParams(parms, callback) {
	var now = new Date();
	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('MODELID', sql.NVarChar, parms.MODELID)
			.input('MODEL_XML', sql.Xml, parms.MODEL_XML)
			.input('MODELID_PR', sql.NVarChar, parms.MODELID_PR)
			.input('MODELID_PR_NODEID', sql.NVarChar, parms.MODELID_PR_NODEID)
			.input('UPDUSER', sql.NVarChar, parms.UPDUSER)
			.input('UPDDTTM', sql.DateTimeOffset, now) 
			.query(sqlUpdateModelQuery_Dev)
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
			 
			 
		 ps.prepare(sqlUpdateModelQuery, function (err) {
			 
				 var now = new Date();
			 ps.execute({
				 MODELCATID: parms.MODELCATID, MODELID: result, PROCESSID: parms.PROCESSID, MODEL_XML: parms.MODEL_XML,
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


function ExcuteSQLInsertModelRepository(parms, callback) {
	getNewReposID(parms.MODELID, function (result) {
			 console.log(result);    
		var now = new Date();
		sql.connect(dbConnectionConfig).then(pool => {
			// Query		    
			return pool.request()
				.input('MODELID', sql.NVarChar, parms.MODELID)
				.input('REPOSID', sql.NVarChar, parms.result)
				.input('MODEL_NODEID', sql.NVarChar, parms.MODEL_NODEID)
				.input('REPOSNAME', sql.NVarChar, parms.REPOSNAME)
				.input('REPOSDESC', sql.NVarChar, parms.REPOSDESC)
				.input('REPOSINFO', sql.NVarChar, parms.REPOSINFO)

				.query(sqlInsertModelReposQuery)

		}).then(result => {
			// console.dir(result);
			return callback(result);
		}).catch(err => {
			console.dir(err);
			// ... error checks
		});
	});
} 

 
function ExcuteSQLInsertModelbyPromises(parms, callback)
 {   	 
	getNewModelID(function(result){
//	 console.log(result);    
		 var now = new Date();
		 sql.connect(dbConnectionConfig).then(pool => {
			    // Query		    
			    return pool.request()
					.input('MODELCATID', sql.NVarChar, parms.MODELCATID)
					.input('MODELTYPE', sql.NVarChar, parms.MODELTYPE)
					.input('MODELID', sql.NVarChar, result)
					.input('MODELNAME', sql.NVarChar, parms.MODELNAME)
					.input('MODELDESC', sql.NVarChar, parms.MODELDESC)
					.input('PROCESSID', sql.NVarChar, parms.PROCESSID)
					.input('MODEL_XML', sql.Xml, parms.MODEL_XML)
					.input('MODELID_PR', sql.Xml, parms.MODELID_PR)
					.input('MODELID_PR_NODEID', sql.Xml, parms.MODELID_PR_NODEID)
					.input('INSUSER', sql.NVarChar, parms.INSUSER)
					.input('INSDTTM', sql.DateTimeOffset, now)
					.input('UPDUSER', sql.NVarChar, parms.UPDUSER)
					.input('UPDDTTM', sql.DateTimeOffset, now) 	
					.query(sqlInsertModelQuery_Dev)            
	         
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
	SelectModel: ExcuteSQLSelectModelbyPromises,
	UpdateModel : ExcuteSQLUpdateModelbyPromises,
	InsertModel : ExcuteSQLInsertModelbyPromises,
	DeleteModel: ExcuteSQLDeleteModelbyPromises,
	UdataModelParams: ExcuteSQLUpdateModelParams,
	InsertModelRepos: ExcuteSQLInsertModelRepository
};