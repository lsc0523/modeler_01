
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
	server: 'LCSC18V139\\SQLEXPRESS',
	multipleStatements: true
};

sql.on('error', err => {
	// ... error handler
});


var Modeltable = "PROCESSMODEL";
var ModelRepostable = "PROCESSMODELREPOSITORY";
var ModelHistory = "PROCESSMODELHISTORY";


//sql Qurey
var sqlSelectModelQurey = "SELECT * FROM "+ Modeltable +
                                    " where MODELID=@MODELID and (USE_YN ='Y' or USE_YN is null) order by upddttm";

var sqlSelectModelHistory = "SELECT A.MODELID ,\n" + 
							"CONVERT(CHAR(23), A.CRETDTTM, 21) CRETDTTM ,\n" + 
							"A.PROCESSID ,\n" + 
							"A.MODEL_XML ,\n" + 
							"A.MODELNAME ,\n" + 
							"A.MODELDESC ,\n" + 
							"A.MODELHISTDESC\n" + 
							"FROM PROCESSMODELHISTORY A\n" + 
							"WHERE A.MODELID   = @MODELID " + 
							"ORDER BY UPDDTTM";

var sqlSelectModelEachHistory = "SELECT A.MODELID ,\n" + 
								"CONVERT(CHAR(23), A.CRETDTTM , 21) CRETDTTM ,\n" + 
								"A.PROCESSID ,\n" + 
								"A.MODEL_XML ,\n" + 
								"A.MODELNAME ,\n" + 
								"A.MODELDESC ,\n" + 
								"A.MODELHISTDESC\n" + 
								"FROM PROCESSMODELHISTORY A\n" + 
								"WHERE A.MODELID   = @MODELID " + 
								"AND   CONVERT(CHAR(23), A.CRETDTTM , 21)  = @CRETDTTM  \n" +
								"ORDER BY UPDDTTM";


var sqlModelPagingList = 	"SELECT T.*\n" + 
							"FROM\n" + 
							"(\n" + 
							"SELECT\n" + 
							"MODELCATID, MODELTYPE, MODELID, MODELID_REVISION, MODELNAME, MODELDESC, PROCESSID, MODEL_XML, MODELID_PR, MODELID_PR_NODEID, INSUSER, INSDTTM, UPDUSER,\n" + 
							"CONVERT(CHAR(23), P.UPDDTTM ,21) UPDDTTM, ISNULL( MODELDIAGRAM_CNT ,0 ) MODELDIAGRAM_CNT , ROW_NUMBER() OVER (ORDER BY P.UPDDTTM) RNUM\n" + 
							"FROM\n" + 
							"PROCESSMODEL P )T\n" + 
							"WHERE T.RNUM BETWEEN @START AND @END\n" + 
							"AND (USE_YN = 'Y'\n or USE_YN is null)\n" + 
							"ORDER BY\n" + 
							"T.UPDDTTM\n";


var sqlUpdateModelQuery = 'update ' + Modeltable + ' set MODEL_XML=@XML where MODELID=@MODELID';

var sqlDeleteModelQuery = 'delete from ' + Modeltable + ' where MODELID=@id';
var sqlDeleteModelHistory =  'delete from PROCESSMODELHISTORY where MODELID=@MODELID and CRETDTTM = @CRETDTTM'


var sqlInsertModelQuery = 'insert into ' + Modeltable + '(MODELCATID, MODELID, PROCESSID, MODEL_XML, INSUSER, INSDTTM, UPDUSER, UPDDTTM)'
	+ ' values (@MODELCATID, @MODELID, @PROCESSID, @MODEL_XML, @INSUSER, @INSDTTM, @UPDUSER, @UPDDTTM)';
var sqlSelectModelIDQurey = 'select top(1) MODELID from ' + Modeltable + ' where (convert(varchar(8), INSDTTM, 112) = convert(varchar(8), getdate(), 112))' + ' order by (MODELID) DESC'

var sqlSelectModelReposIDQurey = 'select top(1) * from ' + ModelRepostable + ' where MODELID=@MODELID order by (REPOSID) DESC'

//All file List from db
var allFileList = 'select * from ' + ModelRepostable + ' where MODELID=@MODELID order by (REPOSID) DESC'

var sqlUpdateModelQuery_Dev = 'update ' + Modeltable + ' set MODELNAME=@MODELNAME, MODELDESC=@MODELDESC, MODEL_XML=@MODEL_XML, MODELID_PR=@MODELID_PR, MODELID_PR_NODEID=@MODELID_PR_NODEID, UPDDTTM=@UPDDTTM  where MODELID=@MODELID';

var sqlInsertModelQuery_Dev = 'insert into ' + Modeltable +
	'(MODELCATID, MODELTYPE, MODELID, MODELID_REVISION,  MODELNAME, MODELDESC,  PROCESSID, MODEL_XML, MODELID_PR, MODELID_PR_NODEID, INSUSER, INSDTTM, UPDUSER, UPDDTTM, MODELDIAGRAM_CNT)'
	+ ' values (@MODELCATID, @MODELTYPE, @MODELID, @MODELID_REVISION, @MODELNAME, @MODELDESC, @PROCESSID, @MODEL_XML, @MODELID_PR, @MODELID_PR_NODEID, @INSUSER, @INSDTTM, @UPDUSER, @UPDDTTM, @MODELDIAGRAM_CNT)';

var sqlInsertModelReposQuery = 'insert into '
	+ ModelRepostable +
	'(MODELID, REPOSID, MODEL_NODEID, REPOSNAME, REPOSINFO)'
	+ ' values (@MODELID, @REPOSID, @MODEL_NODEID, @REPOSNAME, @REPOSINFO)';

//Select Model Company
function ExcuteSQLSelectModelCompany(params, callback) {

	var query = 'SELECT * from + MODELCATEGORYTYPE';

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.query(query)

		}).then(result => {
			// console.dir(result);
			return callback(result);

		}).catch(err => {
			console.dir(err);
			// ... error checks
	});
}


//Select Model
function ExcuteSQLSelectModel(params, callback) {
	var connection = sql.connect(dbConnectionConfig, function (err) {
		if (err) {
			return console.error('error is', err);
		}

		var strsql = sqlSelectModelQurey;

		var ps = new sql.PreparedStatement(connection);
		ps.input('MODELID', sql.NVarChar);

		ps.prepare(strsql, function (err, recordsets) {
			ps.execute({ MODELID: params.MODELID }, function (err, recordset) {
				ps.unprepare(function (err) {
					if (err !== null) {
						console.log(err);
					}
				});
				return callback(recordset);
			});
		});
	});
}
//Select Model Paging Query
function ExcuteSQLSelectModelPaging(params, callback) {
	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('START', sql.NVarChar, params.START)
			.input('END' , sql.NVarChar ,  params.END)
			.query(sqlModelPagingList)
	}).then(result => {
		//console.dir(result);
		return callback(result);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	})
}

//Select Model Promises
function ExcuteSQLSelectModel(params, callback) {

	var strsql = sqlSelectModelQurey;

	if (params.HISTORY == "Y") {
		strsql = sqlSelectModelEachHistory;
	}
	console.log(strsql);

	sql.connect(dbConnectionConfig).then(pool => {
		// Query
		if (params.HISTORY == "Y") {
			return pool.request()
				.input('MODELID', sql.NVarChar, params.MODELID)
				.input('CRETDTTM', sql.NVarChar , params.CRETDTTM)
				.query(strsql)
		}
		else {
			return pool.request()
				.input('MODELID', sql.NVarChar, params.MODELID)
				.query(strsql)
		}

	}).then(result => {
		console.dir(result);
		return callback(result);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	})
}

//Select Model History
function ExcuteSQLSelectModelHistory(params, callback) {

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('MODELID', sql.NVarChar, params.MODELID)
			.input('CRETDTTM' , sql.NVarChar ,  params.CRETDTTM)
			.query(sqlSelectModelHistory)

	}).then(result => {
		//console.dir(result);
		return callback(result);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	})
}

//Select Model Repository
function ExcuteSQLSelectModelRepository(params, callback) {

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			//.input('MODELID', sql.NVarChar, params.MODELID)
			.input('MODELID', sql.NVarChar, params.MODELID)
			.query(sqlSelectModelReposIDQurey)

	}).then(result => {
		console.log(sqlSelectModelReposIDQurey);
		console.dir(result.recordset[0]);
		return callback(result);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	})
}

function ExcuteSQLSelectAllFileList(params, callback) {

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			//.input('MODELID', sql.NVarChar, params.MODELID)
			.input('MODELID', sql.NVarChar, params.MODELID)
			.query(allFileList)

	}).then(result => {
		console.dir(result.recordset[0]);
		return callback(result);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	})
}

function getNewRepositoryID(id, callback) {

	var params = { MODELID: id };

	ExcuteSQLSelectModelRepository(params, function (result) {
		console.log(result);
		if (result.rowsAffected != 0) {
			var data = result.recordset[0].REPOSID;
			//var cnt = data.split('REPOS');
			console.log(data);
			//var cnt	= data.substr(5,5);
			var cnt = data;
			console.log(cnt);

		}
		else {
			var cnt = '00000'
		}

		var zero5 = new Padder(5);
		var newcnt = zero5.pad(Number(cnt));
		console.log(newcnt);
		//var newID = "REPOS" + newcnt;
		//var newID = Number(newcnt);
		var newID = newcnt;
		console.log(newID);

		return callback(newID);

	});
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
// function ExcuteSQLUpdateModel(params, callback) {
// 	var connection = sql.connect(dbConnectionConfig, function (err) {
// 		if (err) {
// 			return console.error('error is', err);
// 		}

// 		var ps = new sql.PreparedStatement(connection);
// 		ps.input('MODEL_XML', sql.Xml);
// 		ps.input('MODELID', sql.NVarChar);

// 		// Xml TO Json
// 		//		 var xmlToJson = convert.xml2json(XML, {compact: true, spaces: 4});
// 		//		 console.log(xmlToJson);

// 		ps.prepare(sqlUpdateModelQuery, function (err) {
// 			ps.execute({ MODEL_XML: params.MODEL_XML, MODELID: params.MODELID }, function (err, result) {
// 				ps.unprepare(function (err) {
// 					if (err !== null) {
// 						console.log(err);
// 					}
// 				});
// 				return callback(result);
// 			});
// 		});
// 	});
// }

// function ExcuteSQLUpdateModelbyPromises(params, callback) {

// 	sql.connect(dbConnectionConfig).then(pool => {
// 		// Query		    
// 		return pool.request()
// 			.input('MODEL_XML', sql.Xml, params.MODEL_XML)
// 			.input('MODELID', sql.NVarChar, params.MODELID)
// 			.input('MODELNAME', sql.NVarChar, params.MODELNAME)
// 			.input('MODELDESC', sql.NVarChar, params.MODELDESC)
// 			.query('update PROCESSMODEL set MODEL_XML=@MODEL_XML , MODELNAME=@MODELNAME , MODELDESC=@MODELDESC where MODELID=@MODELID')
// 	}).then(result => {
// 		console.dir(result);
// 		return callback(result.rowsAffected);
// 	}).catch(err => {
// 		console.dir(err);
// 		// ... error checks
// 	});
// }

function ExcuteSQLUpdateModel(params, callback) {
	var now = new Date();
	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('MODELID', sql.NVarChar, params.MODELID)
			.input('MODEL_XML', sql.Xml, params.MODEL_XML)
			.input('MODELNAME', sql.NVarChar, params.MODELNAME)
			.input('MODELDESC', sql.NVarChar, params.MODELDESC)
			.input('MODELID_PR', sql.NVarChar, params.MODELID_PR)
			.input('MODELID_PR_NODEID', sql.NVarChar, params.MODELID_PR_NODEID)
			.input('UPDUSER', sql.NVarChar, params.UPDUSER)
			.input('UPDDTTM', sql.DateTimeOffset, now)
			.input('MODELDIAGRAM_CNT',sql.NVarChar, params.MODELDIAGRAM_CNT)
			.query(sqlUpdateModelQuery_Dev)
	}).then(result => {
		console.dir(result);
		return callback(result.rowsAffected);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	});
}

function ExcuteSQLUpdateModelHistory(params, callback) {

	ExcuteSQLInsertModelHistory(params, function(result){
		var now = new Date();
		sql.connect(dbConnectionConfig).then(pool => {
			// Query		    
			return pool.request()
				.input('MODELID', sql.NVarChar, params.MODELID)
				.input('MODEL_XML', sql.Xml, params.MODEL_XML)
				.input('MODELNAME', sql.NVarChar, params.MODELNAME)
				.input('MODELDESC', sql.NVarChar, params.MODELDESC)
				.input('MODELID_PR', sql.NVarChar, params.MODELID_PR)
				.input('MODELID_PR_NODEID', sql.NVarChar, params.MODELID_PR_NODEID)
				.input('UPDUSER', sql.NVarChar, params.UPDUSER)
				.input('UPDDTTM', sql.DateTimeOffset, now)
				.query(sqlUpdateModelQuery_Dev)
		}).then(result => {
			console.dir(result);
			return callback(result.rowsAffected);
		}).catch(err => {
			console.dir(err);
			// ... error checks
		});
	});
}


// function ExcuteSQLInsertModel(params, callback) {
// 	// console.log(params);
// 	var connection = sql.connect(dbConnectionConfig, function (err) {
// 		if (err) {
// 			return console.error('error is', err);
// 		}

// 		var ps = new sql.PreparedStatement(connection);
// 		ps.input('MODELCATID', sql.NVarChar);
// 		ps.input('MODELID', sql.NVarChar);
// 		ps.input('PROCESSID', sql.NVarChar);
// 		ps.input('MODEL_XML', sql.Xml);
// 		ps.input('INSUSER', sql.NVarChar);
// 		ps.input('INSDTTM', sql.DateTimeOffset);
// 		ps.input('UPDUSER', sql.NVarChar);
// 		ps.input('UPDDTTM', sql.DateTimeOffset);
// 		ps.input('REPOSIGRUPID', sql.NVarChar);

// 		getNewModelID(function (result) {
// 			console.log(result);
// 		});

// 		ps.prepare(sqlUpdateModelQuery, function (err) {

// 			var now = new Date();
// 			ps.execute({
// 				MODELCATID: params.MODELCATID, MODELID: result, PROCESSID: params.PROCESSID, MODEL_XML: params.MODEL_XML,
// 				INSUSER: params.INSUSER, INSDTTM: now, UPDUSER: params.UPDUSER, UPDDTTM: now, REPOSIGRUPID: ''
// 			}, function (err, result) {
// 				ps.unprepare(function (err) {
// 					if (err !== null) {
// 						console.log(err);
// 					}
// 				});
// 				return callback(result);
// 			});
// 		});



// 		// params.MODELID = getNewModelID();

// 		// console.log(params.MODELID);


// 	});
// }

function ExcuteSQLInsertModelRepository(params, callback) {

	//getNewReposID(params[i].MODELID, function (result) {
	//console.log(result);
	var format = require('pg-format');

	var arraytoarray = [];

	for (var i = 0; i < params.length; i++) {
		var innerarray = [];

		innerarray.push(params[i].MODELID);
		innerarray.push(params[i].REPOSID);
		innerarray.push("");
		innerarray.push(params[i].REPOSNAME);
		innerarray.push(params[i].REPOSINFO);
		//innerarray.push(params[i].REPOSID);

		arraytoarray.push(innerarray);
	}

	/*
	var values = [
		[ 1, 'jack' ],
		[ 2, 'john' ],
		[ 3, 'jill' ],
	];
	*/

	//console.log(format('INSERT INTO test_table (id, name) VALUES %L', values));
	var query = 'INSERT INTO ' + ModelRepostable +
		' (MODELID, REPOSID, MODEL_NODEID, REPOSNAME, REPOSINFO)' +
		' VALUES %L';


	var now = new Date();
	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			/*
			.input('MODELID', sql.NVarChar, params.MODELID)
			.input('REPOSID', sql.NVarChar, result)
			.input('MODEL_NODEID', sql.NVarChar, params.MODEL_NODEID)
			.input('REPOSNAME', sql.NVarChar, params.REPOSNAME)
			.input('REPOSDESC', sql.NVarChar, params.REPOSDESC)
			.input('REPOSINFO', sql.NVarChar, params.REPOSINFO)
			*/

			.query(format(query, arraytoarray))

	}).then(result => {
		// console.dir(result);
		return callback(result);

	}).catch(err => {
		console.dir(err);
		// ... error checks
	});
	//});

}
function ExcuteSQLInsertModel(params, callback) {

	getNewModelID(function (newModelID) {
		//	 console.log(result);    
		var now = new Date();
		sql.connect(dbConnectionConfig).then(pool => {
			// Query		    
			return pool.request()
				.input('MODELCATID', sql.NVarChar, params.MODELCATID)
				.input('MODELTYPE', sql.NVarChar, params.MODELTYPE)
				.input('MODELID_REVISION', sql.NVarChar, params.MODELID_REVISION)
				.input('MODELID', sql.NVarChar, newModelID)
				.input('MODELNAME', sql.NVarChar, params.MODELNAME)
				.input('MODELDESC', sql.NVarChar, params.MODELDESC)
				.input('PROCESSID', sql.NVarChar, params.PROCESSID)
				.input('MODEL_XML', sql.Xml, params.MODEL_XML)
				.input('MODELID_PR', sql.NVarChar, params.MODELID_PR)
				.input('MODELID_PR_NODEID', sql.NVarChar, params.MODELID_PR_NODEID)
				.input('INSUSER', sql.NVarChar, params.INSUSER)
				.input('INSDTTM', sql.DateTimeOffset, now)
				.input('UPDUSER', sql.NVarChar, params.UPDUSER)
				.input('UPDDTTM', sql.DateTimeOffset, now)
				.input('MODELDIAGRAM_CNT',sql.NVarChar, params.MODELDIAGRAM_CNT)
				.query(sqlInsertModelQuery_Dev)

		}).then(result => {
			// console.dir(result);
			return callback(result, newModelID);
		}).catch(err => {
			console.dir(err);
			// ... error checks
		});
	});
}
// Save Model History 
function ExcuteSQLInsertModelHistory(params, callback) {

	strSql = 'INSERT INTO ' + ModelHistory + ' (MODELCATID, MODELTYPE, MODELID, CRETDTTM, MODELNAME, MODELDESC, MODELID_PR, MODELID_PR_NODE, PROCESSID, MODEL_XML, MODELHISTDESC, USERID, INSUSER, INSDTTM, UPDUSER, UPDDTTM)'
	strSql = strSql + ' SELECT MODELCATID, MODELTYPE, MODELID, getdate(), MODELNAME, MODELDESC, MODELID_PR, MODELID_PR_NODEID, PROCESSID, MODEL_XML, @MODELHISTDESC, USERID, INSUSER, getdate(), UPDUSER, getdate() FROM PROCESSMODEL'
	strSql = strSql + ' WHERE MODELID=@MODELID';

	console.dir(strSql);

	sql.connect(dbConnectionConfig).then(pool => {
		
		return pool.request()
			.input('MODELID', sql.NVarChar, params.MODELID)
			.input('MODELHISTDESC', sql.NVarChar, params.MODELHISTDESC)
			.query(strSql)

	}).then(result => {
		console.dir(result);
		return callback(result);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	});
}

function ExcuteSQLDeleteModel(params, callback) {

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('MODELID', sql.NVarChar, params.MODELID)
			//.query(sqlDeleteModelQuery)
			.execute('SP_BPMM_MODELER_DELETE_MODEL')
	}).then(result => {
		console.dir(result);
		return callback(result.rowsAffected);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	});
}

function ExcuteSQLDeleteModelHistory(params, callback) {

	console.dir(sqlDeleteModelHistory);
	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		return pool.request()
			.input('MODELID', sql.NVarChar, params.MODELID)
			.input('CRETDTTM', sql.NVarChar, params.CRETDTTM)
			.query(sqlDeleteModelHistory)	
	}).then(result => {
		console.dir(result.rowsAffected);
		return callback(result.rowsAffected);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	});
}



function ExecuteNonQuery(sqlQurey, callback) {
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


//Select Params Data..
function ExcuteSQLSelectQuery(sqlQurey, params, callback) {

	sql.connect(dbConnectionConfig).then(pool => {
		// Query		    
		var request = pool.request();
		for (var key in params) {
			request.input(key, sql.NVarChar, params[key]);
		}
		return request.query(sqlQurey)

	}).then(result => {
		//console.dir(result);
		return callback(result);
	}).catch(err => {
		console.dir(err);
		// ... error checks
	})
}

module.exports = {
	NonQuery: ExecuteNonQuery,
	SelectModel: ExcuteSQLSelectModel,

	//모델 변경 이력 조회
	SelectModelHistory: ExcuteSQLSelectModelHistory,
	SelectModelRepos: ExcuteSQLSelectModelRepository,
	//UpdateModel: ExcuteSQLUpdateModelbyPromises,
	InsertModel: ExcuteSQLInsertModel,
	//InsertModelHistory: ExcuteSQLInsertModelHistorybyPromises,
	DeleteModel: ExcuteSQLDeleteModel,
	DeleteModelHistory : ExcuteSQLDeleteModelHistory,
	UpdateModelParams: ExcuteSQLUpdateModel,
	UpdateModelandInsertHistory: ExcuteSQLUpdateModelHistory,
	InsertModelRepos: ExcuteSQLInsertModelRepository,

	//FileList...
	SelectAllFileList: ExcuteSQLSelectAllFileList,
	getNewReposID: getNewRepositoryID,
	SelectQueryParams : ExcuteSQLSelectQuery,

	//paging
	SelectPagingModel : ExcuteSQLSelectModelPaging,

	//Select Company
	SelectModelCompany : ExcuteSQLSelectModelCompany
};