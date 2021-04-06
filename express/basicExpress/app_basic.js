const express = require('express');
const app = express();

app.set('port',process.env.PORT || 3000);

app.get('/',(req,res)=>{
    res.send('Hello Express!');
});

app.listen(app.get('port'),()=>{
    console.log(`express Basic 서버가 ${app.get('port')}번 포트에서 대기 중입니다.`);
});

/*
app.set(.. , process.env.PORT || 3000) : 포트번호를 환경변수에 설정하여 사용합니다.

res.send() : HTTP 모듈을 사용하면 http.ServerResponse에 존재하는 res.write() 와 res.end()를 사용하였습니다.
  하지만 express에서는 지원하지 않아 res.send()를 사용합니다.
  res.send()는 res.end()와 다르게 보내는 내용의 정보를 읽어 res.Header의 Content-Type을 자동적으로 지정해줍니다.
*/