const http = require('http');

http.createServer((req,res)=>{
  console.log(req.url, req.headers.cookie);
  res.writeHead(200,{'Set-Cookie' : 'name = seongbeen;','Content-Type' : 'text/plain; charset = utf-8'});
  res.end('Hello Cookie!');
})
  .listen(3000,()=>{
      console.log('cookie서버가 3000번 포트에서 대기중입니다.');
  })

/*
Set-Cookie 헤더를 통해 쿠키를 생성할 수 있습니다.

console.log(req.headers.cookie)의 output을 보면 favicon.ico가 존재하는데 이것은 웹 브라우저에서 탭 타이틀옆에 존재하는 이미지를 의미합니다.
브라우저는 HTML 안에 favicon에 대한 정보가 존재하는지 확인하고 존재하지 않으면
다시 서버로 favicon에 대한 요청을 보내는 것입니다.

*/