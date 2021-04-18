# ROUTE

이전에는 app.use()에 경로를 설정해 주는 방식으로 라우팅을 하였습니다. 하지만 이러한 방식은 분기별로 처리해야 하기 때문에 복잡하고 확장성도 좋지않으며 가독성도 떨어집니다. 따라서 Express에서 제공하는 라우팅 전용 객체 route를 사용하여 보다 나은 서버를 만드는 법을 공부합니다.

## express.route

router Object는 라우팅을 위한 작은 응용 프로그램이라 생각할 수 있습니다. 라우터 객체는 app.use()와 같이 미들웨어 처럼 간단하게 사용할 수 있습니다.

### 사용법

```javascript
const express = require('express');
const router = express.Router([option]);

router.use((req,res,next)=>{
  //...
  next();
});

router.get('/user',()=>{
 //..
});
```

## util

### next()

router객체를 사용하지 않은 기본 라우팅에서는 express 객체를 사용하여 라우터를 만들어 미들웨어를 다뤘습니다.
router 객체에서도 next()를 사용하여 미들웨어간 연결이 이루어집니다. 그러나 express객체와 router객체 간 미들웨어들은 next()를 사용하여 연결할 수 없습니다.

```javascript
app.use((req,res,next)=>{
  console.log('express 객체의 next() 사용');
},(req,res,next)=>{
  console.log('express 객체를 통한 미들웨어이기 때문에 작동합니다.');
  res.send();
});

router.use((req,res,next)=>{
  console.log('router 객체에 달려있는 미들웨워 이기 때문에 실행되지 않습니다.');
})
```

### 라우트 매개변수 패턴

라우터 주소에는 regex를 비롯한 특수 패턴들을 사용할 수 있습니다. 그중에 자주 쓰이는 매개변수 패턴을 알아보겠습니다.

```javascript
router.get('/user/:id',(req,res,next)=>{
  console.log(req.params, req.query);
})
```

주소 뒤에 존재하는 :id는 :id라는 문자열에 대해 라우팅하겠다는 말이 아니고 이 위치에 들어오는 값을 id 라는 변수에 넣어서 관리하겠다는 뜻입니다.
따라서 /user/123, /user/qweq 등의 주소에 반응합니다. 이렇게 라우트 매개변수로 들어온 값은 req.params 객체안에 들어가있습니다. 

이 패턴을 사용할 때 주의점은 일반 라우터보다 뒤에 위치해야 한다는 점입니다. 다양한 라우터들을 아우르는 와일드카드 역할을 하기 때문에 위치를 잘 지정해주어야 다른 라우터들을 방해하지 않습니다.


## router.route()

하나의 주소에 대해 여러 Method를 연결하여 더 짧고 편리한 라우터를 만들 수 있습니다.

```javascript
router.route('/')
  .get(middleware1)
  .post(middleware2)
  .put(middleware3);
```


## Reference

[Express Route](https://expressjs.com/ko/4x/api.html#router)
