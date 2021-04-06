const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '')=>
  cookie
    .split(';')
    .map(v=> v.split('='))
    .reduce((acc,[k,v])=>{
        acc[k.trim()]= decodeURIComponent(v);
        return acc;
    },{});

http.createServer(async(req,res)=>{
  const cookies = parseCookies(req.headers.cookie);

  // route : /login
  if(req.url.startsWith('/login')){
    const {query} = url.parse(req.url);
    const {name} = qs.parse(query);
    const expires = new Date();

    //쿠키의 유효 시간을 현재 시간 + 5분으로 설정
    expires.setMinutes(expires.getMinutes()+ 5);

    res.writeHead(302,{
      Location:'/',
      'Set-Cookie' : `name = ${encodeURIComponent(name)}; Expires=${expires.toGMTString()};HttpOnly;Path='/`
    });
    res.end();

  //name 이라는 쿠키가 있는 경우 -> 로그인이 되어있는 경우
  }else if(cookies.name){
    res.writeHead(200,{'Content-Type' : 'text/plain; charset=utf-8'});
    res.end(`${cookies.name}님 안녕하세요`);

  }else{
    try{
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200,{'Content-Type' : 'text/html; charset=utf-8'});
      res.end(data);
    }catch(err){
      console.error(err);
      res.writeHead(500,{'Content-Type':'text/plain;charset=utf-8'});
      res.end(err.massage);
    }
  }

})
  .listen(3000,()=>{
    console.log('cookie2 서버가 3000번 포트에서 대기 중입니다.');
  });

/*
parseCookie()는 쿠키의 key=value 형태를 Js object 형태인 {key : value} 형태로 바꾸는 함수입니다.

29번째 줄 : 
  name = ${encodeURIComponent(name)}는 헤더에 한글이 설정이 안되니 때문에 encode를 하여 특정 다른 문자열로 바꾼 것입니다.
  헤더에서 Content-Type : "charset=utf-8"로 설정해 주면 다시 한글로 나타낼 수 있습니다.

  expires.toGMTString() 메서드는 Deprecated 되었으므로 toUTCString() 사용이 권장됩니다.


쿠키는 브라우저의 Application 탭에서 확인할 수 있듯이 노출되어 있으며 조작되기 쉽습니다.
따라서 이름 같은 민감한 개인정보를 쿠키에 넣으면 안됩니다.
*/