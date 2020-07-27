const express = require('express');
const logging = require('../logging');
const router = express.Router();

//table 조회
router.post('/view-grid', function(req, res){
    // logging.info('view-grid: '+ JSON.stringify(req.body));

    // let querystr = 'SELECT study_date, grade, original_id, dailyno FROM LIST_DAILY_ALGORITHM_TEST';
    let querystr = 'SELECT * FROM LIST_DAILY_ALGORITHM_TEST';
    let queryparams = [];
    let rdata = {};

    DB.query(querystr, queryparams, function(err, result){
        if(err){
            logging.error('view-grid: ' + err);
            rdata.err = err;
            rdata.result = 0;
            rdata.message = 'view-grid error!';
            res.status(400).json(rdata);
            return;
        }

        logging.info('view-grid result : '+ JSON.stringify(result));

        rdata.result = 1;
        rdata.data = result;
        res.status(200).json(rdata);
    });
});

//table 상태 : insert, update, delete
router.post('/update-grid',function(req, res){
    logging.info('update-grid: '+ JSON.stringify(req.body));
    
    let list = req.body;    //stat의 변화가 있는 데이터 리스트
    console.log('list 개수 : '+ list.length);

    let totalCount = 0; //상태 수정 개수
    let isComplete = false;
    let rdata = {};

    let sumquery = '';
    let iquery = 'INSERT INTO LIST_DAILY_ALGORITHM_TEST (study_date, grade, original_id, trim_date) VALUES (?,?,?,?)';
    let uquery = 'UPDATE LIST_DAILY_ALGORITHM_TEST SET study_date=?, grade=?, original_id=?, trim_date=? WHERE dailyno=?';
    let dquery = 'DELETE FROM LIST_DAILY_ALGORITHM_TEST WHERE dailyno=?';

    //
    sumquery += 'select a.* FROM abc a;';
    sumquery += 'insert into .... ;';

    // uqery + param 을 채워주고... 
    // uquery = 'UPDATE LIST_DAILY_ALGORITHM_TEST SET study_date=?, grade=?, original_id=?, trim_date=? WHERE dailyno=?';
    // param 채워주고 다 더하기 

    /*
    sumquery += uquery; // update 1 
    sumquery += uquery; // update 2
    sumquery += uquery; // update 3 
    sumquery += uquery;

    param = [];
    */
    

    



    for(var i=0; i <list.length; i++){
        console.log('list idx: '+ list[i].stat);

        //데이터 추가 stat = I >> insert
        if(list[i].stat === 'I'){
            console.log('insert >>>');
            
            totalCount++;
            let param = [list[i].study_date, list[i].grade, list[i].original_id, list[i].trim_date];
            
            DB.query(iquery, param, function(err, result){
                totalCount --;
                //count가 0이 되면 완료!
                if(totalCount === 0 && !isComplete){
                    logging.info('INSERT DONE');
                    rdata.result = 1;
                    isComplete = true;
                    // rdata = result[0];
                    res.status(200).json(rdata);
                }
                
                if(err){
                    logging.error('grid-I : ' + err);
                    rdata.err = err;
                    rdata.result=0;
                    rdata.message='insert 오류';
                    res.status(400).json(rdata);
                    // return;
                }
            });
        }
        
        //데이터 수정 stat = U >> update
        if(list[i].stat === 'U'){
            console.log('update >>>');
            
            totalCount++;
            let param = [list[i].study_date, list[i].grade, list[i].original_id, list[i].trim_date, list[i].dailyno];

            DB.query(uquery, param, function(err, result){
                totalCount--;

                if(totalCount === 0 && !isComplete){
                    rdata.result = 1;
                    isComplete = true;
                    res.status(200).json(rdata);                    
                }
                
                if(err){
                    logging.error('grid-U : ' + err);
                    rdata.err = err;
                    rdata.result=0;
                    rdata.message='update 오류';
                    res.status(400).json(rdata);
                    // return;
                }

            });
        }
        
        //데이터 삭제 stat = D >> delete
        if(list[i].stat === 'D'){
            console.log('delete >>>');
            
            totalCount++;
            let param = [list[i].dailyno];

            DB.query(dquery, param, function(err, result){
                totalCount--;

                if(totalCount === 0 && !isComplete){
                    rdata.result = 1;
                    isComplete = true;
                    res.status(200).json(rdata);
                }
                
                if(err){
                    logging.error('grid-D : ' + err);
                    rdata.err = err;
                    rdata.result=0;
                    rdata.message='delete 오류';
                    res.status(400).json(rdata);
                    // return;
                }
            });
        }
        
        if (list[i].stat === '' || list[i].stat === null) {
            logging.error('grid 작업 상태 표시가 없음 :: ' + list[i].stat);
            continue; //에러가 있는 것은 건너뛰고 계속해서 진행함
        }
        
    }//for 
});

module.exports = router;