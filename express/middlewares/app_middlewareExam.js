const express = require('express');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use((req,res,next)=>{
  console.log('모든 Req에 실행됩니다.');
  next();
});

app.get('/',(req,res,next)=>{ // 이부분은 미들웨어 입니다.
  console.log('GET / 요청에만 실행 됩니다.');
  next();
}, (req,res)=>{ // 이부분은 라우터 입니다.
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});


//Error handling
app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'),()=>{
    console.log(`middlewareExam 서버가 ${app.get('port')}번 포트에서 대기 중입니다.`);
});

/*
app.use(middleWare(req,res,next)) :
  use : HTTP Method 부분입니다. GET, POST, DELETE, PUSH 등 모든 요청에 대해 응답을 합니다.
  middleWare(req,res,next) : 미들웨어의 인자로 꼭 next를 널어주어야 합니다. 요청이 들어오면 위에서 부터 순서대로 미들웨어에 들어가게됩니다.
    따라서 미들웨어에서의 처리가 끝나면 다음 미들웨어로 요청을 넘겨주어야 합니다. 넘겨주지 않으면 요청은 해당 미들웨어에 계속 머물게 됩니다.

app.get('/',middleware(req,res,next),route(req,res)) :
  HTTP method = GET, path = '/' 에서만 실행됩니다.
  route : 미들웨어에서 next()를 하지 않을 때 요청은 이리로 넘어오게 됩니다. 

app.use((err,req,res,next)=>{}) :
  에러 처리 전용 미들웨어 입니다. 어느 미들웨어나 요청에서든 에러가 발생하면 err 인자를 포함한 총 4개의 인자를 가지고있는
  미들웨어로 넘어오게 됩니다. 이 때는 next를 통해 넘어오는것이 아닙니다.
  에러 처리 미들웨어를 설정하지 않더라도 express에서 어느정도 처리를 하지만 꼭 에러처리 미들웨어를 만들어서 직접 처리하는것이 좋습니다.
*/