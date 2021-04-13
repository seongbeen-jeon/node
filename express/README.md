# Express

Express 모듈을 사용하는 방법에 대해 공부합니다.

Express에서 말해주는 간단한 구조의 서버부터 여러 디자인 패턴을 통한 안정된 구조의 서버까지 공부합니다.

## npm - nodemon

nodemon은 node.js로 만든 어플리케이션을 쉽게 개발 할 수 있게 도와주는 툴입니다. 서버는 코드가 수정 되어도 즉시 반영 되지 않는데 서버를 재시작해줘야 합니다. nodemon은 파일의 내용이 변경되면 자동적으로 서버를 재시작하게 되어 개발을 편하게 해줍니다.

### nodemon 설치

```
npm install nodemon
```
### nodemon 실행

```
nodemon pathname
```
### Reference

[Npm - nodemon](https://www.npmjs.com/package/nodemon)


## Process

Process는 내장객체로 현재 실행되고 있는 노드 프로세스에 대한 정보를 담고 있습니다.

### process.env

env는 Environment의 약자로 시스템의 환경 변수임을 알 수 있습니다. 시스템 환경 변수는 노드에 직접적인 영향을 미치기도 하는데 대표적인것이 메모리의 사이즈를 설정, 스레드의 개수 등이 있습니다.

Process.env는 시스템 환경변수 뿐만아니라 임의로 환경 변수를 저장할 수 있습니다. 따라서 코드에 넣을 수 없는 중요한 정보들(서비스 키, DB 로그인 정보)들을 저장하기 위해 사용하기도 합니다.

```javascript
const secretID = process.env.SECRET_ID;
const secretCODE = process.env.SECRET_CODE;
```


## req,res

express의 req,res 객체는 http 모듈의 req,res 객체를 확장한 것입니다. 따라서 기존 res.writeHead, res.write, res.end 등의 메서드들을 사용할 수 있지만 express의 기능이 워낙 편리하여 잘 사용하지 않는다고 합니다.

### 메서드 체이닝

req, res 객체의 메서드는 메서드 체이닝을 지원하는 경우가 많습니다. 메서드 체이닝을 사용하여 코드를 더 줄일 수 있습니다.

``javascript
res
  .status(201)
  .cookie('name','seongbeen')
  .redirect('/admin')
```