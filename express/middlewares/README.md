# MiddleWares

미들웨어들은 Express의 정수 입니다. 그 중 자주 쓰이는 몇가지의 미들웨어에 대해 알아보겠습니다.

미들웨어를 사용할때는 인자에 next가 없는 경우가 많은데 대체로 미들웨어 내부에 next()가 존재하고 자동적으로 실행되기 때문입니다.

## index
1. morgan
2. dotenv
3. cookie-parser
4. session
5. body-parser
6. path
7. static
8. 미들웨어 활용하기

## morgan

모건은 추가적인 log를 남기기 위해 사용하는 미들웨어 입니다. 옵션을 통해 원하는 로그를 얻을 수 있습니다.

**syntax**
```javascript
morgan(format,options)
```

### Reference

[npm morgan](https://www.npmjs.com/package/morgan)


## dotenv

dotenv는 ```.env``` 파일에 있는 환경변수들을 읽어오기 위한 모듈입니다.

```.env```는 코드에 쓰기 민감한 개인정보나 크리티컬한 값들을 따로 꺼내어 안전하게 보관하고 편하게 관리하기 위한 환경설정용 파일입니다.

### 사용법

```javascript
require(dotenv).config()
```

dotenv은 프로젝트의 맨 위에서 실행해야 합니다.

추가적인 환경변수를 만들기 위해서는 .env에서 한줄에 하나씩 ```NAME = VALUE``` 형식으로 만듭니다.

example : 
```
//.env
PORT = 3000
DB_ID = seongbeen
DB_HOST = localhost
```

환경 변수 사용하는 방법
```javascript
const db = require('db');
db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.BD_PASS
})
```
### Reference

[npm dotenv](https://www.npmjs.com/package/dotenv)

## Cookie-parser

Express에서 쿠키를 사용할 때는 ```cookie-parse``` 미들웨어를 사용합니다.

```javascript
const cookieParser = require('cookie-parser');

app.use(cookieParser);
```
이제 req.cookies Object에서 저장된 cookie를 불러올 수 있으며, res.cookies() Method를 통해 쿠키를 저장할 수 있습니다.

cookie-parser 미들웨어는 쿠키를 생성/제거 하기 위해 사용되는것은 아닙니다. 요청을 통해 들어온 쿠키를 해석헤 req.cookies 객체를 만드는 일을 합니다.

따라서 쿠키를 생성, 제거할 때는 res.cookie, res.clearCookie 메서드를 사용합니다.

### 쿠키 생성하기

쿠키를 만들 때는 ```res.cookie(cookieName,value,{option})```을 이용합니다.

```javascript

app.get('/',(req,res)=>{
  if(req.cookies.name){
    res.send('./index.html');  
  }else{
    res.cookie(name,req.query.name,{ // req.qeuryString으로 사용자의 이름이 왔다고 가정
      maxAge : 10000;
    });
    res.send(`${res.cookies.name}님 안녕하세요!`);
  }
});
```

옵션의 종류는 http에서 쿠키를 사용할 때와 마찬가지로 maxAge, expires, path, domain, secure, httpOnly, signed 등이 있습니다.

### 쿠키 읽기

쿠키는 ```req.cookies.cookie_name```에 저장됩니다.

### 쿠키 수정하기

쿠키를 수정할 때는 생성할 때와 마찬가지로 res.cookie()를 이용합니다.

```javascript
app.post('/user',(req,res)=>{
  var age += req.cookies.age;

  res.cookie('age',age);
  res.send('한 살 더 먹으셨네요!');
})
```

### Signed Cookie 다루기

Signed Cookie는 값에 서명이 첨부된 쿠키로 암호화에 주로 쓰입니다. 서명은 특정 문자열에 의해 생성되며, 다음과 같이 다룹니다.

1. **cookieParser(secret,options)**
```javascript
app.use(cookieParser('wnfjwhsifweuw'));
app.use(cookieParser(process.env.COOKIE_SECRET)); //.env에 있는 키 사용
```

2. **읽기, 생성하기**

```javascript
req.signedCookies.{cookieName}
res.cookie(name,value,{
  signed: key
});

var name = req.signedCookies.name;
app.get('/login',(req,res)=>{
  res.cookie(userID,'seongbeen',{
    signed: process.env.COOKIE_SECRET
  });
  res.send('로그인 되었습니다.');
})
```

### 쿠키 삭제하기

쿠키 삭제는 ```res.clearCookie(cookieName[,option])```을 사용합니다. 옵션이 있는 쿠키들은 옵션도 일치해야 지워집니다.

1. 옵션이 없는 쿠키
```javascript
res.clearCookie('name');
res.clearCookie('userID');//signed Cookie여도 clearCookie를 통해 삭제가 가능합니다.
```

2. 옵션이 있는 쿠키
```javascript
res.cookie('name','seongbeen',{
  httpOnly:true,
  secure:true,
  expires: new Date() + 5
});

//expires, maxAge 같은 옵션 경우는 생략해도 됩니다.
res.clearCookie('name',{
  httpOnly:true,
  secure:true
});
```

### Reference

[npm cookie-parser](https://www.npmjs.com/package/cookie-parser)



## Session

express-session은 세션 관리용 미들웨어입니다. 로그인등의 이유로 세션을 구현하거나 특정 사용자의 정보를 임시적으로 저장할 때 사용합니다.

express-session을 통해 세션을 만들면 req.session 객체안에 유지됩니다. 하지만 이는 쿠키에 세션 데이터를 저장하는것이 아니고 session ID만 저장합니다. 세션 데이터는 서버쪽에 저장됩니다.

쿠키에서 세션을 다루는 쿠키가 세션 쿠키입니다. 세션 쿠키의 기본 이름은 ```connent.sid``` 입니다.

express-session 1.5.0 버전 이전에는 cookie-parser를 통해 세션을 관리 했기 때문에 cookie-parser가 express-session 미들웨어 이전에 선언이 됐어야 했습니다. 그러나 1.5.0 이후 부터는 ```req/res``` 객체에 바로 read/write가 가능하기 때문에 cookie-parser를 선언하지 않아도 됩니다. 또한 cookie-parser와 같이 사용할 경우 두 미들웨어의 secret이 같지 않으니 둘이 같은 secret을 사용하는지 신경써야 합니다.

기본적으로 express-session의 session 저장소는 메모리 입니다. 따라서 서버를 재시작하면 세션이 초기화 되고 메모리가 가득 차면 더이상의 세션을 생성할 수 없습니다. 따라서 다른 저장소를 사용하여 관리를 해주는것이 좋습니다. 대체로 **Redis**를 사용합니다.

express-session으로 만들어진 세션은 req.session객체에 보관되어 있으니 해당 객체에 접근하여 세션을 관리할 수 있습니다.


### session 사용하기

session을 사용하여 세션을 관리할 객체 req.session을 만듭니다. 

```javascript
const session = require('express-session');

app.use(session({
  resave: false ,
  saveUninitialized: false ,
  secret:process.env.COOKIE_SECRET ,
  cookie:{
    httpOnly:true,
    secure:false
  },
  name:connect.sid
}));
```

```express-session```은 사용할 때 인수로 세션에 대한 옵션을 받습니다.

**resave** : 요청이 올 때 마다 세션을 다시 저장할 것인지 묻는 옵션입니다. 변경의 유무와는 상관없기 때문에 항상 저장 됩니다. ```Default:True``` 이지만 디폴트로 사용하는 것은 Deprecated 되었기 때문에 명시 해주는것이 좋습니다.
만약 client가 parallel한 여러 요청을 보낼 시 race condition을 만들 수 있기 때문에 주의해주어야 합니다. 어느 한 세션이 변경되어 저장되었음에도 변경되지 않은 세션이 resave되어 overwritten 될 수 있기 때문입니다.

**saveUninitialized** : 내용이 없는 세션을 저장할것인지 묻는 옵션입니다. 새로 생성했지만 아직 초기화를 하지 않아 데이터가 없는 빈 세션을 저장할 때 쓰입니다. ```Default:True``` 입니다. 하지만 Deprecated 되었기 때문에 명시하여 사용해주도록 합시다.```True```일때 아직 세션이 존재하지 않는 client가 parallel 한 요청을 보낼 때 race condition이 생길 수 있습니다.

**secret** : sessio ID 쿠키를 서명할 때 사용합니다.

### session 쿠키 다루기

session을 통해 req.session을 만들었으면 세션쿠키를 다룰 수 있습니다. 방법은 매우 간단합니다.

```javascript
req.session.name = 'seongbeen'; // 세션 등록
req.session[name] = 'seongbeen-jeon' // session.name 값 변경
req.sessionID; // 세션 ID 확인
req.session.destroy(callback) // 모든 세션 제거 

req.session.save(callback) // 세션 저장
```

res.session은 매우 직관적이고 간단합니다. req.session.save()는 세션을 저장하는 메서드 입니다. 하지만 HTTP Response가 날라갈때 자동적으로 실행되니 직접 실행해주지 않아도 됩니다. 특정 상황에서만 실행해주는데 redirect나 웹 소켓에서 시간이 오래걸리는 요청등에서만 사용 됩니다.

### Reference

[npm express-session](https://www.npmjs.com/package/express-session)


## Body-Parser

```body-parser```는 request의 body에 존재 하는 값들을 분석하여 req.body 객체를 만듭니다. 보통 Form 데이터나 AJAX 요청의 데이터를 처리합니다. 단 multipart 데이터는 처리 하지 못합니다.

```body-parser```는 설치하여 사용할 수 있지만 express 4.16.0 버전 부터는 바디파서 미들웨어의 일부 기능이 express에 내장되어 따로 설치하지 않아도 됩니다. ```json```,```url-encoded``` 형식의 데이터는 내장되어 있지만 Raw, Text 형식은 내장되어 있지 않아 바디파서를 설치해야 합니다.

### 사용법

```javascript
// json, URL-encoded는 내장되어있어 express 에서 바로 사용할 수 있습니다.
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Raw, Text 형식은 body-parser를 설치하여 사용해야 합니다.
const bodyParser = require('body-parser');
app.use(bodyParser.Raw()); //Raw는 요청의 본문이 버퍼 데이터 입니다.
app.use(bodyParser.Text());//Text는 텍스트 데이터 입니다.
```

json은 JSON 형태의 데이터 전달 방식을 이고 urlencoded는 url의 쿼리스트링을 통한 전달 방식입니다. ```extended: false```를 하면 내장된 querystring 모듈을 사용하고 ```True``` 일때는 npm의 qs 모듈을 사용합니다. qs모듈은 설치해야 하며 querystring 모듈의 확장판입니다.

HTTP Method가 POST, PUT 일때 서버에서 ```req.on('data')```를 통해 값을 받았습니다. 요청이 스트림형식이기 때문입니다. body-parser에서는 내부적을 스트림을 처리하기 때문에 바로 req.body로 사용할 수 있습니다.

### 데이터의 형식

JSON 형식의 데이터는 { name : 'seongbeen', book:'nodejs'} 이런 모양으로 들어옵니다. 바디파서를 사용하면 같은 모양으로 req.body로 들어옵니다.

urlencoded 형식으로 name=seongbeen&book=nodejs 이런 모양으로 온다면 바디파서를 통해 {name:'seongbeen', book:'nodejs'} 이런 모양으로 req.body로 들어옵니다.

### Reference

[npm body-parser](https://www.npmjs.com/package/body-parser)

-조현영 지음, Node.js 교과서 개정2판, 길벗(2020), p237-238



## Path

Path 모듈은 Node에서 제공해주는 모듈로 파일이나 디렉터리의 위치를 잡는데 사용됩니다.

```javascript
//선언
const path = require('path');
```

### path.join([...paths])

파일이나 디렉터리의 위치를 잡을 때 주로 사용하는 메서드입니다. 옵션으로는 string 형태의 경로를 줍니다. 결과값으로는 주어진 옵션들을 합친 string 형태의 경로가 나옵니다.

또한 옵션의 데이터타입이 string이 아닐때 에러를 생성합니다.

```javascript
path.join('/foo','bar','node');
//return : '/foo/bar/node'

path.join('/foo',{},'bar');
//return : Throws 'TypeError: Path must be a string. Received {}'
```

### 사용법

path는 사용할 때 Node의 Global 객체에 들어있는 __dirname, __filename과 같이 쓰이는 경우가 많습니다.

__dirname 은 현재 모듈의 경로를 알려줍니다. ```path.dirname()```과 같은 일을합니다.
__filename은 현재 모듈의 파일 이름을 포함한 경로를 나타냅니다. 


### Reference

[Node Path](https://nodejs.org/api/path.html)


## Static

static 미들웨어는 정적인 파일을 제공하는 라우터 역할을 하는 미들웨어입니다. 기본적으로 제공되기 때문에 설치나 선언을 하지않고 사용할 수 있습니다.

```javascript
//syntax
app.use('요청 경로',express.static('정적 파일을 제공할 경로'))

app.use('/', express.static('/image'));

//주로 사용하는 형태
app.use(express.static(path.join(__dirname,'/public')));
```

실제 경로에는 정작파일을 제공할 경로('/public')등이 포함되지만 클라이언트는 그 위치를 몰라도 접근할 수 있게 됩니다. 따라서 클라이언트가 접근할 수 있는 영역을 분리시켜 서버의 구조를 숨길 수 있어 보안에 큰 도움이 됩니다.

정적인 파일을 알아서 제공해주기 때문에 fs.readFile 등의 메서드를 실행할 필요 없습니다. 또한 요청들어온 파일이 존재하지 않다면 알아서 next를 사용하기 때문에 다른 미들웨어에서 Error로 처리할 수 있습니다. 파일이 존재한다면 next를 실행하지 않고 끝나 파일을 제공합니다.

### Reference

-조현영 지음, Node.js 교과서 개정2판, 길벗(2020), p237


## 미들웨어 활용하기

미들웨어를 사용할 때 인자로 ```(req,res,next)```를 넣어줍니다. 에러 처리용 미들웨어만 특별히 err 인자 까지 포함해 ```(err,req,res,next)```를 인자로 받습니다.

### next

npm이나 express등에서 제공하는 미들웨어를 사용할 때 next를 인자로 보내지 않는 이유는 이러한 모듈들에서 내부적으로 사용하기 때문입니다. 따라서 순서에 따라 next를 통해 미들웨어가 실행될 수 있고 실행되지 않을 수 있습니다.

특정 미들웨어에 의해 다른 미들웨어들이 실행되지 않는 경우입니다.
```javascript
// static 미들웨어에서 성공적으로 실행을 맞춰 연결이 끝난 경우
// static 밑에 존재하는 미들웨어들은 실행되지 않습니다.

app.use(
  morgan('dev'),
  express.static(path.join('/public')),
  express.json(),
  express.urlencoded({extend:false}),
  cookieParser(process.env.COOKIE_SECRET)
);
```

next를 사용할 때 아무 인자를 넣지 않는 형태로 사용했지만 인자를 넣으면 해당 미들웨어로 이동합니다.

```javascript
app.use((req,res,next)=>{
  //...
  next(); // 바로 다음 미들웨어로 넘어갑니다.
})
app.use((req,res,next)=>{
  //...
  next(err); // 에러 처리 미들웨어로 넘어갑니다.
})
app.use((req,res,next)=>{
  //이전 미들웨어에서 next(err)을 통해 에러처리 미들웨어로 넘겼으므로 실행되지 않습니다.
})
app.use((err,req,res,next)=>{
  //...
})
```

### 미들웨어간 데이터 공유

응답을 처리하기위해 이전 미들웨어에서 사용한 데이터를 다른 미들웨어에서도 사용할 수 있어야 합니다.

```app.set('data',value)```를 통해 서버에 저장할 수 있지만 이런 경우 서버에 저장되기 때문에 다른 요청들과 혼합될 수 있습니다. app.set은 주로 서버를 설정할 때 사용합니다.

```app.session```을 통해서도 세션에 데이터를 저장할 수 있지만 이는 세션이 유지되는 동안 데이터가 유지되니 같은 유저의 다른요청에서도 유지됩니다. 따라서 메모리가 낭비되거나 값이 혼합될 수 있으니 좋지 못한 방식입니다.

```req``` 요청 객체를 사용하면 알맞는 데이터 공유를 할 수 있습니다. 해당 요청에 대해서만 데이터가 유지되고 특정될 수 있으니 간결하면서도 좋은 방식입니다. 그러나 속성명이 겹치지 않게 주의 해야합니다. ex) req.body, req.session 등..

```javascript
app.use((req,res,next)=>{
  req.data = '저장할 데이터';
  next();
})

app.use((req,res,next)=>{
  console.log(req.data);
  //output : 저장할 데이터
})
```

### 미들웨어에서 미들웨어 사용하기

미들웨어 안에서 미들웨어를 사용할 수 있습니다. 더욱 유연하고 미들웨어의 기능을 확장할 수 있습니다.

```javascript
app.use((req,res,next)=>{
  if(process.env.NODE_ENV === 'PRODUCTION'){
    morgan('combined')(req,res,next);
  }else{
    morgan('dev')(rqe,res,next);
  }
});
```