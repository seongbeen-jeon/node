const http = require('http');
const fs = require('fs').promises;

http.createServer(async(req,res)=>{
    try{
        var data = await fs.readFile('./server_errBasic.html');
        res.writeHead(200,{'Content-Type' : 'text/html; charset = utf-8'});
        res.end(data);
    } catch(err){
        console.error(err);
        res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'});
        res.end(err.message);
    }
})
  .listen(3000,()=>{
      console.log('errBasic서버가 3000번 포트에서 대기중 입니다.')
  });

/*
promises, async, awiat : ES6에서 생겨난 개념이다. 콜백을 간단하게 사용할 수 있게 해준다.
  -> javascript의 내용이니 github javascript Repository에 따로 정리할 예정

try, catch : error가 발생할 수 있는 코드를 try catch에 가둬 error handling을 한다.

catch 내부의 코드 :
  console.error(err) : 에러가 발생하면 확인하고 문제를 고치기 위해 꼭 무슨 에러가 났는지 알아야한다.
  res : 에러가 발생했더라도 클라이언트는 응답을 기다리니 꼭 에러가 났다는 응답을 보내주어야 한다.
    writeHead() : text/html이 아니고 text/plain인 이유는 밑 res.end에서 보내는 err.message가 html형식이 아니고 일반 문자열이기 때문에 plain이다.
 */