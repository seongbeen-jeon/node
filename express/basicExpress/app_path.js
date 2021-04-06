const express = require('express');
const path = require('path');

const app = express();

app.set('port',process.env.PORT || 3000);

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'/index.html'));
});

app.listen(app.get(port),()=>{
    consolo.log(`path 서버가 ${app.get(port)}번 포트에서 대기 중입니다.`);
});

/*
res.sendFile(path[,options][,fn]) :
  File을 보내는 함수 입니다. 현재 사용중인 file system을 이용합니다.
  path에 주어진 파일이름의 확장자를 보고 Content-Type을 정합니다.
  옵션을 통해 상대적위치나 절대적 위치 둘 중 어느것을 사용할지 선택할 수 있습니다.
*/