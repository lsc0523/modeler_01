var express = require("express") 
var path = require ("path")

var server = express()
var webpack = require('webpack')
//var common = require('./app/common');

// webpack의 output 장소인 dist를 express static으로 등록한다.
const staticMiddleWare = express.static("public");
// webpack 설정
const config = require("./webpack.config.js");
const compiler = webpack(config);

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
var sqlQurey = 'SELECT * FROM PROCESSMODEL ORDER BY UPDDTTM';

//html render
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'ejs');

//Call Post Util..
var bodyParser = require('body-parser')
server.use(bodyParser.urlencoded({extended: false}))

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


//Util...
function isNotEmpty(_str){
	var obj = String(_str);
	if(obj == null || obj == undefined || obj == 'null' || obj == 'undefined' || obj == '' ) return false;
	else return true;

}

server.get('/home2' , function(req , res){
	console.log("home2...");
	res.render('home2');
});


/*
router.get('/page/:page',function(req,res,next)
{
    var page = req.params.page;
    var sql = "select idx, name, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate,hit from board";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('page', {title: ' 게시판 리스트', rows: rows, page:page, length:rows.length-1, page_num:10, pass:true});
        console.log(rows.length-1);
    });
});

*/

server.get('/home/:page' , function(req , res){
	console.log("home...");
	Mssql.NonQuery(sqlQurey,function(result){
		//console.log(result);
		var page = req.params.page;

		res.render('home' , { 
				data : result.recordset,
				page : page,
				page_num : 10,
				pass: true,
				length : result.recordset.length -1
			});
	});
});

server.get('/viewer' , function(req , res){
	console.log("viewer...");
	console.log(req.query.id);
	var xmldata = "";
	if(req.query.id == "" || req.query.id == undefined){
		res.render('viewer', {name : ""});
	}
	else{
		var params = { MODELID : req.query.id };
		Mssql.SelectModel(params, function(result){
			xmlData = result.recordset[0].MODEL_XML;
			console.log(xmlData);
			res.render('viewer', {name : xmlData});
		});
	}
});


server.get('/modelPopup',  function(req , res){
	res.render('modelPopup');
})

server.get('/modeler' , function(req , res){
	console.log('modeler...Start...');
	console.log(req.query.id);
	var xmldata = "";
	var modelID = "";
	var modelName ="";
	var modelDetailName ="";
	var JsFileList = "";


	if(req.query.id == "" || req.query.id == undefined){
		
		res.render('modeler', {
			name : "" , 
			modelID : "" , 
			JsmodelName : "" , 
			JsmodelDetailName : "" ,
			JsFileList : JsFileList
		});

	}
	else{

		var params = { MODELID : req.query.id };

		Mssql.SelectModel(params, function(result){
			console.log(result);
			
			xmlData = result.recordset[0].MODEL_XML;
			modelID = result.recordset[0].MODELID;
			modelName = result.recordset[0].MODELNAME;
			modelDetailName = result.recordset[0].MODELDESC;	
			//console.log(modelID);

			var fileParams = { MODELID : req.query.id};

			Mssql.SelectModelRepos(fileParams , function(file_result){
				console.log(file_result);

				if(file_result.rowsAffected !=0 ){
					JsFileList = file_result.recordset[0].REPOSINFO
				}

				res.render('modeler', {	
						name : xmlData, 
						modelID : modelID,
						JsmodelName : modelName,
						JsmodelDetailName : modelDetailName,
						JsFileList : JsFileList
						});

			});

			/*
			res.render('modeler', {	name : xmlData, 
									modelID : modelID,
									JsmodelName : modelName,
									JsmodelDetailName : modelDetailName
									});
			*/
		});
	}

});

server.get('/about' , function(req , res){
	console.log("about...")
	res.send('about directory.. LG CNS modeler...');
});



//var fs = require('fs');
//var multiparty = require('multiparty');
//upload.any()

function InsertModelData(req, callback){
	var params = { MODELCATID : 'LGC_MOD001_20200828',
				   PROCESSID : req.body.processID ,
				   MODEL_XML : req.body.id,
				   MODELNAME : req.body.modelName,
				   MODELDESC : req.body.modelDetailName,
				   INSUSER : 'LGCNS' ,
				   UPDUSER : 'LGCNS'}


	Mssql.InsertModel(params, function(result, newModelID){
		console.log(11);
		console.log(result);	
		console.log(newModelID);	
		if(isNotEmpty(req.files)){
			var pramsFile = { REPOSINFO : req.files[0].filename , 
							  REPOSNAME : req.files[0].originalFilename ,
							  MODELID : newModelID
							};
			Mssql.InsertModelRepos(pramsFile , function(file_result){
				console.log(22);
				console.log(file_result);
				callback(file_result);
			});
		}else{
			callback(result);
		}
	});
}

server.post('/insert' , upload.any() ,function(req , res){

	console.log(req.body);
	console.log(req.files);
	console.log("insert...");

	InsertModelData(req, function(file_result){
		console.log(file_result);
		res.send("OK");
	});
});


server.post('/update' , upload.any() ,  function(req , res){
	console.log("update...");
	//console.log(req.body);
	console.log(req.body.id);
	console.log(req.body.modelID);

	var params = { MODELID : req.body.modelID , 
				   MODEL_XML : req.body.id ,
				   MODELNAME : req.body.modelName,
				   MODELDESC : req.body.modelDetailName
				 };

	Mssql.UdataModelParams(params, function(result){
		console.log(result);

		if(isNotEmpty(req.files)){
			var pramsFile = { REPOSINFO : req.files[0].filename , 
							  REPOSNAME : req.files[0].originalFilename ,
							  MODELID : req.body.modelID 
							};
			Mssql.InsertModelRepos(pramsFile , function(file_result){
				res.send("OK");	
			});
		}else{ 
			res.send("OK");		
		}
	});
});


server.get('/delete' , function(req , res){
	console.log("delete...");
	//console.log(req.query.id);
	var params = { MODELID : req.query.id };

	Mssql.DeleteModel(params , function(result){
		//console.log(result);
		Mssql.NonQuery(sqlQurey,function(result){
		//console.log(result);

			res.render('home' , { 
				data : result.recordset,
				page : 1,
				page_num : 10,
				pass: true,
				length : result.recordset.length -1
			});
			//res.render('home' , { data : result.recordset});
		});
	});
	//res.render('home2');
});

server.get('/download',function(req,res){
	res.download("./uploads/" + req.query.id);
});

server.get('/login' , function(req , res){
	console.log("Login...");
	res.render('login');
});


server.listen(3000, () => {
	console.log("Server is Listening")
});