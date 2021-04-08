# MiddleWares

## index
1. morgan
2. dotenv
3. cookie-parser
4. session
5. body-parser
6. path
7. static

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

express-session을 통해 세션을 만들면 req.session 객체안에 유지됩니다. 하지만 이는 쿠키 스스로가 세션 데이터를 저장하는것이 아니고 단지 session Id만을 저장합니다. 세션 데이터는 서버쪽에 저장됩니다.

쿠키에서 세션을 다루는 쿠키가 세션 쿠키입니다. 세션 쿠키의 기본 이름은 connent.sid 입니다.

express-session 1.5.0 버전 이전에는 cookie-parser를 통해 세션을 관리 했기 때문에 cookie-parser가 express-session 미들웨어 이전에 선언이 됐어야 했습니다. 그러나 1.5.0 이후 부터는 ```req/res``` 객체에 바로 read/write가 가능하기 때문에 cookie-parser를 선언하지 않아도 됩니다. 또한 cookie-parser와 같이 사용할 경우 두 미들웨어의 secret이 같지 않으니 둘이 같은 secret을 사용하는지 신경써야 합니다.

기본적으로 express-session의 session 저장소는 메모리 입니다. 따라서 서버가 재시작하면 세션이 초기화 되고 메모리가 가득 차면 더이상의 세션을 생성할 수 없습니다. 따라서 다른 저장소를 사용하여 관리를 해주는것이 좋습니다. 대체로 **Redis**를 사용합니다.

express-session으로 만들어진 세션은 req.session객체에 보관되어 있으니 해당 객체에 접근하여 세션을 관리할 수 있습니다.


### Reference

[npm express-session](https://www.npmjs.com/package/express-session)




