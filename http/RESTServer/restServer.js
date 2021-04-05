const http = require('http');
const fs = require('fs').promises;

const users = {}; // 데이터 저장용

http.createServer(async(req,res)=>{
    try{
        console.log(req.method, req.url);
        if(req.method ==='GET'){
            if(req.url === '/'){
                var data = await fs.readFile('./restFront.html');
                res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
                return res.end(data);
            }else if(req.url ==='./about'){
                var data = await fs.readFile('./rest_about.html');
                res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
                return res.end(data);
            }else if(req.url === './user'){
                res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
                return res.end(JSON.stringify(uesrs));
            }

            try{
                var data = await fs.readFile(`${req.url}`);
                res.writeHead(200,{'Content-Type' : 'text/plain; charset = utf-8'});
                return res.end(data);
            }catch(err1){
                //주소에 해당하는 자원을 찾지 못했다는 404 NOT Found error 발생
            }

        }else if(req.method === 'POST'){
            if(req.url ==='/users'){
                let body = '';
                req.on('data',(data)=>{
                    body += data;
                });

                return req.on('end',()=>{
                    console.log('POST / 본문 : ',body);
                    const {name} = JSON.parse(body);
                    const id = Data.now();
                    users[id] = name;
                    res.writeHead(201, {'Content-Type' : 'Text/plain, charset = utf-8'});
                    res.end('POST success!');
                });
            }
        } else if (req.method === 'PUT') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('PUT 본문(Body):', body);
                    users[key] = JSON.parse(body).name;
                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    return res.end('PUT Success!');
                });
            }
        }else if(req.method === 'DELETE'){
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key];
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('ok');
              }
            }
        res.writeHead(404);
        return res.end('NOT FOUND');
    }catch(err2){ 
        console.error(err2);
        res.writeHead(500,{'Content-Type' : 'text/plain; charset = utf-8'});
        res.end(err2.message);
    }
})
  .listen(3000,()=>{
      console.log('rest서버가 3000번 포트에서 대기중 입니다.');
  });


/*
GET /users -> res.end content-Type : 'application/json' -> json의 MIME 타입이다.

return res.end() :
  몇몇 res.end()에는 return이 붙어있는데 이러한 이유는 res.end()는 연결을 마치는 것이지 함수를 끝내지 않기 때문이다. 연결이 끝났을 때 함수가 같이 끝나야 온전한 처리를 마친다.
  
  위 코드에서 69,70 번째 줄 처럼 else 밖에 존재하여 실행 될 가능성이 있는 코드가 존재하면 함수가 끝나지 않아 원치 않는 코드를 실행하여 문제가 생길 수 있다.
*/

