const http = require('http');

var server = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
});
server.listen(3000);

server.on('listening',()=>{
    console.log('onMethod 서버가 3000번 포트에서 대기중입니다.');
});

server.on('error',(err)=>{
    console.error(err);
});

/*
server.on() : httpServer 객체에 on 을 통해 이벤트 리스너를 달 수 있다.
*/