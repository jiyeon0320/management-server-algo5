const conf = require("./package.json");
const PORTNO = conf.server.port;    //packgae.json에 설정되어 있는 포트번호로 연결
const mysql = require("mysql");
const cors = require("cors");
const express = require("express");
const app = express();

//라우터
const tableRouter = require('./routes/algo5TableRouter');

//전역변수 설정
global.async = require("async");
global.logging = require("./logging");
global.config = conf;

//express 설정
app.use(cors());
app.use(express.json());    //body-parser기능. JSON으로 쓰겠다
app.use(express.urlencoded({extended: true}));  //인코딩
app.set('port', process.env.PORT || PORTNO);    //기본 포트를 app 객체에 속성으로 설정

//라우터 사용
app.use('/table', tableRouter);


async.waterfall(
    [function(callback){
        logging.info('DB 조회');
        //DB 연결
        //package.json에 DB 정보가 있음
        global.DB = mysql.createPool(config.algo5); 
        callback(null);
    }],

    function(err, result){
        if(err){
            logging.error('Error : ' + err);
            return;
        }

        app.listen(PORTNO, ()=>{
            logging.info('express is running on : ' + PORTNO);
        })
    }
);