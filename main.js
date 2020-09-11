var express = require("express") 
var path = require ("path")

var server = express()
var webpack = require('webpack')

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
var sqlQurey = 'select * from PROCESSMODEL';

//html render
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'ejs');

//Call Post Util..
var bodyParser = require('body-parser')
server.use(bodyParser.urlencoded({extended: false}))


server.get('/home' , function(req , res){
	console.log("home...");
	Mssql.NonQuery(sqlQurey,function(result){
		//console.log(result);
		res.render('home' , { data : result.recordset});
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
		Mssql.SelectByModelID(req.query.id, function(result){
			xmlData = result.recordset[0].MODEL_XML;
			console.log(xmlData);
			res.render('viewer', {name : xmlData});
		});
	}
});

server.get('/modeler' , function(req , res){
	console.log('modeler...');
	console.log(req.query.id);
	var xmldata = "";
	if(req.query.id == "" || req.query.id == undefined){
		res.render('modeler', {name : ""});
	}
	else{
		Mssql.SelectByModelID(req.query.id, function(result){
			xmlData = result.recordset[0].MODEL_XML;
			res.render('modeler', {name : xmlData});
		});
	}

});

server.get('/about' , function(req , res){
	console.log("about...")
	res.send('about directory.. LG CNS modeler...');
});

server.post('/update' , function(req , res){
	console.log("update...");
	//console.log(req.body);
	console.log(req.body.id);

	Mssql.UpdateModel(req.body.id, "MOD0002_20200911", function(result){
		console.log(result);		
	});

});






server.post('/insert' , function(req , res){
	console.log("insert...");
	//console.log(req.body);
	console.log(req.body.id);

	var params = { MODELCATID : 'LGC_MOD001_20200828',
				   PROCESSID : 'PROD0003',
				   MODEL_XML : req.body.id,
				   INSUSER : 'gschun',
				   UPDUSER : 'gschun'}
				   ;

	Mssql.InsertModel(params, function(result){
		console.log(result);	

		res.send({ result : "success"});	
	});

});

// server.get('/modeler/:id' , function(req , res){
// 	console.log(req.params.id);
// 	//var sqlModelQurey = 'SELECT * FROM PROCESSMODEL WHERE MODELID = "MOD001_20200828" ';
// 	//var sqlSelectModelQurey = 'select * from PROCESSMODEL where MODELID=@id' ;
// 	//console.log(sqlSelectModelQurey);
// 	Mssql.ExecuteNonQuery(sqlQurey, function(result){
// 		//console.log(result);
// 		//console.log(result.recordset[0]);
// 		//console.log(result.recordset[0].MODEL_XML);
// 		console.log(result);
// 		console.log(1);
// 		console.log(result.recordset[0].MODEL_XML);
// 		res.render('modeler', {name :result.recordset[0].MODEL_XML});
// 	});
// });

server.listen(3000, () => {
    console.log("Server is Listening")
});