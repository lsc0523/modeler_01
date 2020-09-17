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


server.get('/home2' , function(req , res){
	console.log("home2...");
	res.render('home2');
});

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
		Mssql.SelectModel(req.query.id, function(result){
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
	var modelID = "";
	if(req.query.id == "" || req.query.id == undefined){
		res.render('modeler', {name : "" , modelID : ""});
	}
	else{
		Mssql.SelectModel(req.query.id, function(result){
			console.log(result);
			xmlData = result.recordset[0].MODEL_XML;
			modelID = result.recordset[0].MODELID;
			console.log(modelID);
			res.render('modeler', {name : xmlData, modelID : modelID});
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
	console.log(req.body.modelID);

	Mssql.UpdateModel(req.body.id, req.body.modelID, function(result){
		console.log(result);		
	});

	res.send({result : req.body.modelID});

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
	});

	res.send({result : "OK"});

});

server.get('/delete' , function(req , res){
	console.log("delete...");
	console.log(req.query.id);

	Mssql.DeleteModel(req.query.id , function(result){
		console.log(result);
	});

	res.send({ result : "success deleting bpmn.."});
});


//File Logic..
var fs = require('fs');
var multiparty = require('multiparty');

server.post('/upload', function (req, res) {
	var form = new multiparty.Form({
        autoFiles: false,                // 요청이 들어오면 파일을 자동으로 저장할 것인가
        uploadDir: 'uploads/',           // 파일이 저장되는 경로(프로젝트 내의 temp 폴더에 저장됩니다.)
        maxFilesSize: 1024 * 1024 * 1024 // 허용 파일 사이즈 최대치
    });

	form.parse(req, function (error, fields, files) {
        // 파일 전송이 요청되면 이곳으로 온다.
        // 에러와 필드 정보, 파일 객체가 넘어온다.
        var path = files.fileInput[0].path;
        var newPath = 'uploads/'+ files.fileInput[0].originalFilename;

        fs.rename(path, newPath , function(err){
        	if( err ) throw err;
        	console.log('File Renamed!');
        });

		var params = {
			MODELID: req.body.id,
			MODEL_NODEID: 'DataObjectReference_0001',
			REPOSNAME: req.body.id,
			REPOSDESC: 'L&C도면',
			REPOSINFO: 'L&C도면.pdf'
		};


		Mssql.InsertModelRepos(params, function (result) {
			console.log(result);
		});



        console.log(path);
        res.send(path); // 파일과 예외 처리를 한 뒤 브라우저로 응답해준다.
    });
});


server.get('/download',function(req,res){
	res.download("./uploads/image1.png");
});


server.get('/fileOpen', function(req  , res){
	fs.stat('./uploads/qoFtGnCoGofnrmoWHGcnDSCu.png', function(error, stats) {
   		fs.open('./uploads/qoFtGnCoGofnrmoWHGcnDSCu.png', "r", function(error, fd) {  // 읽기 모드로 test.txt 파일 열기
   			console.log("파일의 크기: ", stats.size);
       		if(error) console.log("error: ", error);    // 에러 있을 시 에러 출력
        		/*
        		let buffer = new Buffer(100);        // 버퍼의 크기를 100으로 함
        		
        		fs.read(fd, buffer, 0, buffer.length, 84, function(error, bytesRead, buffer) {
            			// buffer에 담을 위치 0, txt 파일 시작 위치는 84
            			let data = buffer.toString("utf8");
            			console.log(data);
            			console.log("읽은 버퍼 크기: ", bytesRead);
            	});
            	*/
            });
   	});
});


server.listen(3000, () => {
	console.log("Server is Listening")
});