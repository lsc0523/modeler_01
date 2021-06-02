var express = require("express")
var path = require("path")
//import common from './app/common.js';

var server = express()
var webpack = require('webpack')
//var common = require('./app/common');
// webpack의 output 장소인 dist를 express static으로 등록한다.
const staticMiddleWare = express.static("public");
// webpack 설정
const config = require("./webpack.config.js");
const compiler = webpack(config);

//var mod = require("korean-text-analytics");
//var task = new mod.TaskQueue();

//var { parse } = require('./charParse.js')

// 웹팩을 미들웨어로 등록해서 사용하기 위한 모듈
const webpackDevMiddleware = require("webpack-dev-middleware")(
	compiler,
	config.devServer
)

// 웹팩미들웨어가 static 미들웨어 이전에 위치!
server.use(webpackDevMiddleware);
server.use(staticMiddleWare);

//DB 연결 정보
var Mssql = require('./db_mssql.js');
// var sqlQurey = 'SELECT * FROM PROCESSMODEL ORDER BY UPDDTTM';

var sqlQurey = 'SELECT MODELCATID, MODELTYPE, MODELID, MODELID_REVISION,  ' + 
					  'MODELNAME, MODELDESC,  PROCESSID, MODEL_XML, MODELID_PR,' + 
					  'MODELID_PR_NODEID, INSUSER, INSDTTM, UPDUSER,  CONVERT(CHAR(19), p.upddttm , 20) UPDDTTM, ISNULL( MODELDIAGRAM_CNT , 0 ) MODELDIAGRAM_CNT' 	
			+ ' FROM PROCESSMODEL p ORDER BY UPDDTTM;'

//html render
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'ejs');

//Call Post Util..
var bodyParser = require('body-parser')
server.use(bodyParser.urlencoded({ extended: false }))

//cookie...
var cookie = require('cookie-parser');
server.use(cookie());

//session..
var sessionParser = require('express-session');
server.use(sessionParser({
	secret: '@#@$MYSIGN#@$#$',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 5, // 쿠키 유효기간 1시간
	},
}));

//files...
var multer = require('multer');

//server.use(multer());
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, getFile(file));
	}
});

function getFile(file) {
	let oriFile = file.originalname;
	let ext = path.extname(oriFile);
	let name = path.basename(oriFile, ext);
	let rnd = Math.floor(Math.random() * 90) + 10; // 10 ~ 99
	return Date.now() + '-' + rnd + '-' + name + ext;
}

var upload = multer({
	storage: storage
});

//var common = require('./app/common.js');
//Util...
function isNotEmpty(_str) {
	var obj = String(_str);
	if (obj == null || obj == undefined || obj == 'null' || obj == 'undefined' || obj == '') return false;
	else return true;
}

server.get('/BBS' , function(req,res){
	console.log("BBS");
	console.log(req.cookies);

	if (isNotEmpty(req.session.user)){
		var getPostQuery = "SELECT * FROM POSTS";
		Mssql.NonQuery(getPostQuery, function(result){
			res.render('BBS',{
				data: result.recordset,
				sess: req.session.user.id
			})
		})
	}
	else{
		res.redirect('login');
	}
});

server.get('/home2', function (req, res) {
	console.log("home2...");
	console.log(req.cookies);

	if (isNotEmpty(req.session.user)) {
		var reasonTypeQurey = "SELECT A.* FROM REASONCODE A WHERE A.CODE_TYPE = 'LG_C_TYPE'";
		Mssql.NonQuery(reasonTypeQurey, function (result) {
			res.render('home2', {
				data: result.recordset,
				sess: req.session.user.id
			});
		});
	}
	else {
		res.redirect('login');
	}
});


server.get('/modelListData', function(req , res){
	console.log("modelListData...");

	var params = { 
					START : req.query.startpage,
					END : req.query.endpage
				}

	Mssql.SelectPagingModel(params, function (result) {
		//console.log(result);
		//var page = req.params.page;
		console.log(req.session.user);

		res.json( {
			data: result.recordset,
			sess: req.session.user.id
		});
	});

})

server.get('/modelList', function (req, res) {
	console.log("modelList...");

	var CategorytypesqlQuery = 'SELECT * FROM MODELCATEGORYTYPE;'
	var CategorysqlQuery = 'SELECT * FROM MODELCATEGORY;'

	if (isNotEmpty(req.session.user)) {
		Mssql.NonQuery(sqlQurey + CategorytypesqlQuery + CategorysqlQuery, function (result) {
			console.log(result);
			var page = req.params.page;
			console.log(req.session.user);

			res.render('modelList', {
				data: result.recordsets[0],
				cattype : result.recordsets[1],
				cat : result.recordsets[2],
				page: page,
				page_num: 10,
				pass: true,
				length: result.recordset.length - 1,
				sess: req.session.user.id
			});
		});
	} else {
		res.redirect('/login');
	}
});

server.get('/companycheck', function (req, res){
	console.log("companycheck");
	var CategorytypesqlQuery = 'SELECT * FROM MODELCATEGORYTYPE;'
	var CategorysqlQuery = "SELECT * FROM MODELCATEGORY;"

	if(isNotEmpty(req.session.user)){
		Mssql.NonQuery(CategorytypesqlQuery+CategorysqlQuery, function(result){
			console.log(result);
			console.log(req.session.user);

			res.send({'factory' : result.recordsets[0], 'process1' : result.recordsets[1]});
		})
	}
});

server.get('/viewer', function (req, res) {
	console.log("viewer...");
	console.log(req.query.id);
	var xmldata = "";
	if (req.query.id == "" || req.query.id == undefined) {
		res.render('viewer', { name: "" });
	}
	else {
		var params = { MODELID : req.query.id ,
					   HISTORY : req.query.his,
					   CRETDTTM : req.query.creDate
		};

		Mssql.SelectModel(params, function (result) {
			xmlData = result.recordset[0].MODEL_XML;
			//console.log(xmlData);
			res.render('viewer',
				{
					name: xmlData,
					sess: req.session.user.id
				}
			);
		});
	}
});

//Popups...
server.get('/modelPopup', function (req, res) {
	res.render('modelPopup');
})

server.get('/downloadPopup', function (req, res) {
	res.render('downloadPopup');
})


var viewModelerQuery = "WITH CATCTE (MODELCATID_PR, MODELCATID, MODELCATNAME, LEVEL, SEQ_PATH) AS (\n" + 
						"--ANCHOR MEMBER DEFINITION\n" + 
						"SELECT MODELCATID_PR, MODELCATID, MODELCATNAME, 1 LEVEL,\n" + 
						"CONVERT(NVARCHAR (MAX), MODELCATID) SEQ_PATH\n" + 
						"FROM MODELCATEGORY A\n" + 
						"WHERE MODELCATID_PR IS NULL\n" + 
						"UNION ALL\n" + 
						"--RECURSIVE MEMBER DEFINITION\n" + 
						"SELECT A.MODELCATID_PR, A.MODELCATID, A.MODELCATNAME, B.LEVEL+1, B.SEQ_PATH + '/' + CONVERT(NVARCHAR (MAX), A.MODELCATID) SEQ_PATH\n" + 
						"FROM MODELCATEGORY A\n" + 
						"INNER JOIN CATCTE B ON A.MODELCATID_PR = B.MODELCATID\n" + 
						")\n" + 
						"SELECT *\n" + 
						"FROM CATCTE\n" + 
						"ORDER BY LEVEL ASC\n" + 
						"OPTION (MAXRECURSION 100)\n";

server.get('/modeler', function (req, res) {
	console.log('modeler...Start...');
	console.log(req.query.id);
	var xmldata = "";
	var modelID = "";
	var modelName = "";
	var modelDetailName = "";
	var JsFileList = "";

	Mssql.NonQuery(viewModelerQuery, function (result_data) {

		if (req.query.id == "" || 
			req.query.id == undefined || 
			req.query.id == 'undefined') {

			res.render('modeler', {
				name: "",
				modelID: req.query.DB_ID,
				JsmodelName: "",
				JsmodelDetailName: "",
				JsFileList: JsFileList,
				type: req.query.DB_CATID,
				enable : "Y",
				data: result_data.recordset,
				sess: req.session.user.id
			});

		}
		else {

			var params = { MODELID: req.query.id };
			var enable = req.query.enable;

			Mssql.SelectModel(params, function (result) {
				//console.log(result);

				xmlData = result.recordset[0].MODEL_XML;
				modelID = result.recordset[0].MODELID;
				modelName = result.recordset[0].MODELNAME;
				modelDetailName = result.recordset[0].MODELDESC;
				modelType = result.recordset[0].MODELCATID;

				var fileParams = { MODELID: req.query.id };

				Mssql.SelectAllFileList(fileParams, function (file_result) {
					//console.log(file_result);

					if (file_result.rowsAffected != 0) {
						JsFileList = file_result.recordset;
					}

					res.render('modeler', {
						name: xmlData,
						modelID: modelID,
						JsmodelName: modelName,
						JsmodelDetailName: modelDetailName,
						JsFileList: JsFileList,
						type: modelType,
						enable : enable,
						data: result_data.recordset,
						sess: req.session.user.id
					});

				});
			});
		}

	});


});

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

function InsertModelData(req, callback) {
	var params = {
		MODELCATID: req.body.type,
		PROCESSID: req.body.processID,
		MODEL_XML: req.body.id,
		MODELNAME: req.body.modelName,
		MODELDESC: req.body.modelDetailName,
		MODELID_REVISION : '',
		MODELDIAGRAM_CNT : req.body.diagramCnt,
		INSUSER: req.session.user.id,
		UPDUSER: req.session.user.id
	}


	Mssql.InsertModel(params, function (result, newModelID) {
		console.log(11);
		console.log(result);
		console.log(newModelID);

		if (isNotEmpty(req.files)) {

			Mssql.getNewReposID(newModelID, function (repoID) {

				var newRepoID;
				var pramsArray = [];

				if (isNotEmpty(repoID)) {
					newRepoID = repoID;
				}
				else {
					newRepoID = 1;
				}

				for (var i = 0; i < req.files.length; i++) {
					var pramsFile = {
						REPOSID: Number(newRepoID) + 1,
						REPOSINFO: req.files[i].filename,
						REPOSNAME: req.files[i].originalFilename,
						MODELID: newModelID
					};

					newRepoID = Number(newRepoID) + 1;
					pramsArray.push(pramsFile);
				}

				Mssql.InsertModelRepos(pramsArray, function (file_result) {
					console.log(22);
					console.log(file_result);
					callback(file_result, newModelID);
				});

			});

		} else {
			callback(result, newModelID);
		}
	});
}

server.post('/insert', upload.any(), function (req, res) {

	//console.log(req.body);
	//console.log(req.files);
	console.log("insert...");

	InsertModelData(req, function (file_result, newModelID) {
		console.log(file_result);
		console.log(newModelID);
		res.json({ id : newModelID});
	});
});


server.post('/update', upload.any(), function (req, res) {
	console.log("update...");

	var historyYN = req.body.historyYN;
	var params = {
		MODELID: req.body.modelID,
		MODEL_XML: req.body.id,
		MODELNAME: req.body.modelName,
		MODELDESC: req.body.modelDetailName,
		MODELHISTDESC : req.body.modelComment,
		UPDUSER: req.session.user.id
	};

	if (historyYN != "false") {
		Mssql.UpdateModelandInsertHistory(params , function(result){
			console.log("Add History..");
			res.json({ id: params.MODELID });
		})
	} else {

		Mssql.UpdateModelParams(params, function (result) {
			console.log(result);

			if (isNotEmpty(req.files)) {

				Mssql.getNewReposID(params.MODELID, function (repoID) {

					var newRepoID;
					var pramsArray = [];

					if (isNotEmpty(repoID)) {
						newRepoID = repoID;
					}
					else {
						newRepoID = 1;
					}

					for (var i = 0; i < req.files.length; i++) {
						var pramsFile = {
							REPOSID: Number(newRepoID) + 1,
							REPOSINFO: req.files[i].filename,
							REPOSNAME: req.files[i].originalFilename,
							MODELID: params.MODELID
						};

						newRepoID = Number(newRepoID) + 1;
						pramsArray.push(pramsFile);
					}

					Mssql.InsertModelRepos(pramsArray, function (file_result) {
						console.log(22);
						console.log(file_result);
						res.json({ id: params.MODELID });
					});

				});

			} else {
				res.json({ id: params.MODELID });
			}
		});
	}
});


server.get('/delete', function (req, res) {
	console.log("delete...");
	//console.log(req.query.id);
	var params = { MODELID: req.query.id };
	//var pagenum = req.query.page;
	//console.log(pagenum);

	Mssql.DeleteModel(params, function (result) {

		Mssql.NonQuery(sqlQurey, function (result) {

			res.render('modelList', {
				data: result.recordset,
				page: 1,
				page_num: 10,
				pass: true,
				length: result.recordset.length - 1,
				sess: req.session.user.id
			});
		});
	});
});

server.get('/download', function (req, res) {
	res.download("./uploads/" + req.query.id);
});

server.get('/', function (req, res) {
	res.redirect('/login');
});

server.get('/login', function (req, res) {
	console.log("Login...");
	var session = req.session.user;

	if (isNotEmpty(session)) {
		res.redirect('/home2');
	} else {
		res.render('login');
	}
});


server.get('/loginUser', function (req, res) {
	console.log("login...User");

	var user = { id: req.param("id") };
	res.cookie("user", user);
	console.log(req.cookies);

	req.session.user = {
		id: req.param("id"),
		currentTime: new Date()
	};

	console.log(req.session.user);

	req.session.save(function () {
		res.redirect('/home2');
	});
});

server.get('/logout', function (req, res) {
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect('/login');
		}
	})
});

server.post('/createUser', function (req, res) {
	console.log("Create...User");

	console.log(req.body.id);
	console.log(req.body.pass);
	console.log(req.body.email);

	res.json({ 'result': 'ok' });

});

server.get('/userPopup', function (req, res) {
	res.render('userPopup');
});


//Mail app
var nodemailer = require('nodemailer');

server.get('/mailSend', function (req, res) {

	var mailAddress = req.query.email;
	console.log(mailAddress);

	if (mailAddress) {

		var transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: '587',
			auth: {
				user: 'dugudcjfwin@gmail.com',
				pass: 'ahddl7411@'
			},
			secureConnection: 'false',
			tls: {
				ciphers: 'SSLv3',
				rejectUnauthorized: false
			}
		});

		var mailOption = {
			from: 'dugudcjfwin@gmail.com',
			to: mailAddress,
			subject: '모델러에 초대합니다',
			//text : 'Invite You Modeler.'
			html: '<h1>공정운영시나리오 모델러 초대합니다.!</h1><a href="http://10.65.78.213:3000/login">초대수락</a>'
		};

		transporter.sendMail(mailOption, function (err, info) {
			if (err) {
				console.error('Send Mail error : ', err);
				res.json({ 'result': 'ng' });
			}
			else {
				console.log('Message sent : ', info);
				res.json({ 'result': 'ok' });
			}
		});
	}
})

server.get('/Simulation' , function(req ,res){
	
	if (isNotEmpty(req.session.user)) {
		var modelID = req.query.id;
		var params = { MODELID : modelID};
		Mssql.SelectModelHistory(params , function(result){
			
			var page = req.params.page;
			//console.log(req.session.user);

			res.render('simulation', {
				data: result.recordset,
				page: page,
				page_num: 10,
				pass: true,
				length: result.recordset.length - 1,
				sess: req.session.user.id
			
			});
		});

		/*
		Mssql.NonQuery(sqlQurey, function (result) {
			//console.log(result);
			var page = req.params.page;
			console.log(req.session.user);

			res.render('history', {
				data: result.recordset,
				page: page,
				page_num: 10,
				pass: true,
				length: result.recordset.length - 1,
				sess: req.session.user.id
			});
		});
		*/
	} else {
		res.redirect('login');
	}
});


server.get('/history/:page' , function(req ,res){
	
	if (isNotEmpty(req.session.user)) {
		var modelID = req.query.id;
		var params = { MODELID : modelID};
		Mssql.SelectModelHistory(params , function(result){
			
			var page = req.params.page;
			//console.log(req.session.user);

			res.render('history', {
				data: result.recordset,
				page: page,
				page_num: 10,
				pass: true,
				length: result.recordset.length - 1,
				sess: req.session.user.id
			
			});
		});

		/*
		Mssql.NonQuery(sqlQurey, function (result) {
			//console.log(result);
			var page = req.params.page;
			console.log(req.session.user);

			res.render('history', {
				data: result.recordset,
				page: page,
				page_num: 10,
				pass: true,
				length: result.recordset.length - 1,
				sess: req.session.user.id
			});
		});
		*/
	} else {
		res.redirect('login');
	}
});

server.get('/select', function (req, res) {
	var sqlQurey = req.query.params.sqlQurey;
	var params = req.query.params;

	Mssql.SelectQueryParams(sqlQurey, params, function (result) {
		res.json({ data: result });
	});
})


let users = [ 
				{
					id : 1  , name : 'yeo'
				},
				{ id :2 , name: 'chun'}
			]

server.get('/users', (req , res) => {
	return res.json(users);
})

server.listen(3000, () => {
	console.log("Server is Listening")
});