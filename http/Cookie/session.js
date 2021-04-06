const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '')=>
  cookie
    .split(':')
    .map(v=>v.split('='))
    .reduce((acc,[k,v])=>{
        acc[k.trim()] = decodeURIComponent(v);
        return acc;
    },{});

const session = {};

http.createServer(async(req,res)=>{
  const cookies = parseCookies(req.headers.cookie);

   // route : /login
  if(req.url.startsWith('/login')){
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    const uniqueInt = Date.now();
    session[uniqueInt] = {
      name,
      expires
    };

    res.writeHead(302,{
        'Location' : '/',
        'Set-Cookie' : `session=${uniqueInt}; Expires=${expires.toGMTString()};HttpOnly;Path='/'`
    });
    res.end();

  // 세션 쿠기가 존재하고 만료기간이 지나지 않을 경우
  }else if(cookies.session && session[cookies.session].expires > new Date()){
    res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
    res.end(`${session[cookies.session].name}님 환영합니다.`);

  }else{
    try{
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
      res.end(data);

    }catch(err){
      console.error(err);
      res.writeHead(500,{'Content-Type':'text/plain;charset=utf-8'});
      res.end(err.message);
    }

  }
})
  .listen(3000,()=>{
    console.log('3000번 포트에서 session서버가 대기 중입니다.');
  });

/*
서버에 사용자 정보를 저장하지 않고 세션 아이디만을 가지고 클라이언트와 소통하는 방식을 세션이라고 합니다.

세션 아이디는 꼭 쿠키를 사용해서 주고 받지 않아도 됩니다. 그러나 가장 간단한 방식이기 때문에 대부분의 웹 사이트가
쿠키를 통해 세션을 관리 합니다.

세션을 위해 사용하는 쿠키를 세션 쿠키라고 합니다.

실제 배포용 서버에서는 세션을 위 const session={} 처럼 변수에 저장하지 않는데, 이런식으로 메모리에 저장할 시
서버가 멈추거나 재시작되면 메모리에 저장된 변수들은 사라지기 때문입니다. 또한 서버의 메모리가 부족하면 세션을 저장하지 못하는 경우도 생깁니다.
따라서 보통 Redis나 MemCached 같은 DB에 넣어 둡니다.

실제 배포시에는 위 코드를 사용하지 못하는데 보안에 취약하기 때문입니다. 따라서 다른 사람이 미리 만들어둔 검증된 코드를 사용하는것이 좋습니다.
*/