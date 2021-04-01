const http = require('http');

http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html;charset = uth-8'});
    res.write("<h1>Hello World!</h1>");
    res.end("<p>Hello server</p>");

}).listen(3000,()=>{
    console.log("res 서버가 3000번 포트에서 대기중입니다.")
});

/*
response 객체의 3가지 메소드
res.writeHead() : Response객체의 헤더를 작성한다.
res.weite() : Response객체의 Body를 작성한다.
res.end() : parameter로 들어온 값을 보내며 클라이언트에게 응답을 한다. / 요청 처리를 마무리 한다.

httpServer.listen() : http.createServer를 통해 만든 서버 객체를 컴퓨터에 올려 응답 대기 상태로 만든다. 
*/