# Cookie

HTTP는 stateless한 특징을 가졌기 때문에 서버는 클라이언트가 누구인지 알 수 없습니다. 따라서 서버는 요청을 보낸 클라이언트가 누구인지 기억하기 위해 응답을 보낼 때 작은 데이터를 같이 보내는 경우가 있는데 이 작은 데이터가 쿠키 입니다.

쿠키는 서버가 사용자의 웹 브라우저에 저장하는 작은 데이터 입니다. 브라우저는 쿠키들을 가지고 있다가 쿠키를 저장시킨 서버에 요청을 보낼 때 가지고 있는 쿠키들을 함께 전송합니다.

쿠키는 주로 세 가지 목적을 위해 사용됩니다.

1. **세션 관리(Session Management)**
  로그인, 장바구니 등

2. **개인화 (Persnalization)**
  사용자 선호, 테마등의 세팅

3. **트래킹(Tracking)**
  사용자의 행동을 기록하고 분석하는 용도

과거에는 클라이언트에 데이터를 저장할 수 있는 유일한 방법이기에 많이 사용되었습니다. 그러나 클라이언트가 요청을 보낼때 가지고 있는 모든 쿠키를 같이 전송하기 때문에 성능면에서 악영향을 미칠 수 있습니다.

지금은 modern storage APIs를 이용하여 저장하는 것이 권장됩니다.
- 많은 양의 데이터를 저장할 때 : IndexedDB
- 적은 양의 데이터를 저장할 때 : Web storage API

## 쿠키 만들기

서버는 HTTP 요청에 대해 응답을 할 때 ```Set-Cookie```헤더를 전송할 수 있습니다. 쿠키는 브라우저에 의해 저장되며 같은 서버로 부터 만들어진 요청들의 Cookie 헤더안에 포함되어 전송됩니다. 만료일이나 지속시간, 보안옵션등을 명시할 수 있으면 만료된 쿠키는 더이상 보내지지 않습니다. 또한 도메인이나 경로등을 설정하여 쿠키가 보내지는 것을 제한할 수 있습니다.

Set-Cookie의 값으로는 제한된 ASCII만 들어가야 하므로 줄바꿈등을 넣을 수 없습니다. 또한 헤더에는 한글을 설정할 수 없어 encode 해줘야 합니다.

### Set-Cookie 그리고 Cookie 헤더

서버는 클라이언트에게 ```Set-Cookie```헤더를 보내 쿠키를 저장하라고 명령을 보낼 수 있습니다.
```javascript
//syntax
Set-Cookie : key = value; options

Set-Cookie : name=seongbeen
```

반대로 클라이언트가 저장된 쿠키를 서버로 보낼 때는 ```Cookie```헤더를 사용합니다.

```javascipt
Cookie : key = value; key = value;
```

### LifeTime
**쿠키의 지속시간**을 정하는 옵션입니다. 

- Expires : 쿠키가 끝나는 날짜를 명시합니다.
- Max-age : 쿠키의 수명을 명시합니다. Expires과 같이 쓰일시 Expires는 무시 됩니다.
```
Set-Cookie : name = seongbeen; Expires = Mon, 5 Apr 2021 07:28:00 GMT;
// 쿠키는 클라이언트에 저장되기 때문에 서버의 시간이 아닌 클라이언트의 시간을 따릅니다.

Set-Cookie : name = seongbeen; Max-age = 600;
// Max-age는 초 단위로 사용하며 Expires보다 우선적용 됩니다.
```

### 쿠키의 보안
쿠키는 공개된 데이터이고 js에서 사용할 수 있으니 보안이 취약합니다. 따라서 옵션을 사용하여 쿠키를 안전하게 다룰 수 있어야 합니다.

- Secure : Https에서만 쿠키가 전송됩니다.
  
- HttpOnly : Js를 통한 접근을 막습니다.
```
Set-Cookie : name = seongbeen; Max-age = 30 ; Secure; HttpOnly;
```

Secure 쿠키는 HTTPS 상에서 암호화된(encrypted) 요청일 경우에만 전송됩니다. 하지만 Secure 일지라도 쿠키는 본질적으로 안전하지 않고 실직적인 보안을 제공하지 않기 때문에 민감한 정보는 쿠키에 저장하면 안됩니다. 또한 http에서는 쿠키에 Secure 설정을 지시할 수 없습니다.

쿠키는 XSS(Cross Site Scripting) 공격과 CSRF()공격등에 취약하기 때문에 HttpOnly 옵션을 켜두고 쿠키를 사용하는 요청은 서버에서 검증하는 로직을 꼭 마련해둬야 합니다.


### 쿠키의 범위

Domain, Path 옵션은 쿠키의 스코프를 정의합니다.

```
Set-Cookie : name = seongbeen; Domain = mozilla.org;

Set-Cookie : name = seongbeen; Domain = devleoper.mozilla.org; path = /docs/Web
```

도메인을 명시하면 도메인이 일치하는 요청에서만 쿠키가 전송됩니다. 도메인을 명시 하지 않는다면, 현재 문서 위치의 호스트 일부를 기본값으로 합니다.

ex) 도메인을 명시하지 않을 때 = location : developer.mozilla.org -> mozilla.org를 기본값으로 저장한다.

또한 쿠키들은 서브도메인상에 포함되게 됩니다.
Domain = mozilla.org 일 때 developer.mozilla.org 에도 쿠키가 보내집니다.

가끔 다른 도메인의 쿠키들이 있는데, 이런 쿠키들은 써드파티쿠키로 클라이언트를 추적하고 있는 쿠키들입니다. 구글, 페이스북 같은 곳이 써드 파티 쿠키를 적극적으로 사용합니다.

Path 옵션은 경로를 설정합니다. 해당 경로와 일치하는 요청에서만 쿠키가 전송됩니다.


## Reference

[MDN HTTP 쿠키](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)

[zeroCho 알아둬야 할 HTTP 쿠키 & 캐시 헤더](https://www.zerocho.com/category/HTTP/post/5b594dd3c06fa2001b89feb9)