const express = require('express');
const app = express();
const router = express.Router();

router.get('/',(req,res,next)=>{
  next('');
},function(req,res,next){
  console.log('실행 되지 않습니다.1');
  next();
},function(req,res,next){
  console.log('실행 되지 않습니다.2');
  next();
});

router.get('/',(req,res,next)=>{
    console.log('이건 실행 될까요?');
    next();
})

app.get('/',(req,res,next)=>{
  console.log('실행 될까요?');
  next();
})

router.get('/',(req,res)=>{
  console.log('실행됩니다.');
  res.send('Hello, Express');
});

module.exports = router;


/**
 * next()를 사용하면 현재 미들웨어가 장착된 라우터의 다음 미들웨어들을 건너 뛰고 주소가 일치하는 다음 라우터로 넘어갑니다.
 * app 객체에 붙어있는 라우터에서 실행한 미들웨어가 next()를 실행하면 app 객체의 라우터로 넘어갑니다.
 * router 객체에 붙어있는 라우터에서 실행한 미들웨어가 next()를 실행하면 router 객체의 라우터로 넘어갑니다.
 * 
 * => 서로 다른 객체에 존재하는 라우터들은 next로 연동 되지 않습니다. 구별하여 사용하여야 합니다.
 */