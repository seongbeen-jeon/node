# Node 정리

## npm

**npm(Node Packeage Manager)** 은 패키지 관리자로 Node.js를 설치하면 같이 설치되어 사용할 수 있습니다.

패키지는 dependencies를 관리하기 위해 version을 추적할 수 있도록 구성됩니다.

패키지의 버전을 명시할 때는 *semver(sementic version*) 개념을 따릅니다.

### npm init

서비스에 필요한 패키지를 추가하다 보면 패키지의 수가 많아지고 해당 패키지들은 고유한 버전이 있기에 어딘가에 기록해야 합니다.

이때 설치한 패키지의 버전을 관리하는 파일이 바로 package.json입니다. 따라서 노드 프로젝트를 시작하기 전에는 폴더 내부에 무조건 package.json부터 만들고 시작해야 합니다.

이러한 package.json을 만드는 명령어가 ```npm init``` 입니다.


먼저 콘솔로 프로젝트를 시작할 폴더로 이동한 후 명령어를 입력합니다.
    npm init
이 때 여러가지 속성을 초기화 합니다. 그 종류들은 다음과 같습니다.

```
package name: (폴더명)
version: (1.0.0)
description:
entry point:
test command:
git repository:
keywords:
author:
license: (ISC)
```
#### package name
패키지의 이름입니다. package.json의 name 속성에 저장됩니다.
URL이나 Command Line의 일부로 사용되며 214자 이내의 소문자로 작성해야 하며 간결하고 직관적입 이름으로 하되 다른 모듈과의 동일한 이름을 피해야 합니다.

***

#### version
패키지의 버전입니다. npm의 버전은 semver에 따라 엄격하게 관리됩니다.
***

#### description
프로젝트(패키지)의 설명입니다. 패키지를 찾을 때 도움이 됩니다.
***

#### entry point
자바스크립트 실행 파일 진입점입니다. 보통 마지막으로 module.exports를 하는 파일을 지정합니다. package.json의 main속성에 저장됩니다.
***

#### test command
코드를 테스트할 때 입력할 명령어를 의미합니다. package.json scripts속성 안의 test 속성에 저장됩니다.
***

#### repository
코드를 저장해둔 깃(git) 저장소 주소를 의미합니다. 나중에 소스에 문제가 생겼을 때 사용자들이 이 저장소에 방문해 문제를 제기할 수도 있고, 코드 수정본을 올릴 수 있습니다. package.json의 repository 속성에 저장됩니다.
***

#### keywords
키워드는 [npm 공식 홈페이지](https:npmjs.com)에서 패키지를 쉽게 찾을 수 있도록 해줍니다.
***

#### license
패키지의 라이선스를 표기합니다.
오픈 소스라고 해서 모든 패키지를 아무런 제약 없이 사용할 수 있는 것은 아닙니다. 라이선스 별로 제한 사항이 있으므로 설치 전에 반드시 라이선스를 확인해야 합니다.

라이선스 종류 : MIT, ISC, BSD, 아파치, GPS ...
***


### package.json

package.json의 형태
```
{
  "name": "패키지 이름",
  "version": "1.0.0",
  "description": "패키지 내용 설명",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "레파지토리 url 주소"
  },
  "author": "seongbeen-jeon",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/seongbeen-jeon/레파지토리 이름/issues"
  },
  "homepage": "https://github.com/seongbeen-jeon/레파지토리 이름#readme"
}
```

#### script
npm 명령어를 저장해두는 부분입니다. console에서 ```npm run 스크립트 명령어``` 를 입력하면 해당 스크립트가 실행됩니다.
npm run test를 입력하면 echo \"Error: no test specified\" && exit 1 이 실행 됩니다.
echo \"Error: no test specified\" 는 콘솔에 해당 문자열을 출력하라는 뜻이고, exit 1은 에러와 함께 종료하라는 뜻입니다.

보통 start 명령어에 node [파일명]을 저장해두고 npm start로 실행합니다. start나 test같은 스크립트는 run을 붙이지 않아도 실행 됩니다.
***

#### 그 외
npm 명령어를 실행하면 WARN이 등장할 때가 있는데 경고일 뿐이니 걱정은 하지 않아도 됩니다.

audited : 패키지를 설치할 때 audited [숫자] packages라는 문장이 출력되는데 이는 패키지에 있을 수 있는 취약점을 자동으로 검사했다는 의미입니다.
npm audit fix를 입혁하면 npm이 스스로 수정할 수 있는 취약점을 알아서 수정합니다. 주기적으로 수정해주면 좋습니다.
***

### Reference

- 조현영 지음, Node.js 교과서 개정2판, 길벗(2020), 210p

[처음 시작하는 Node.js 개발 - 2 - npm](https://heropy.blog/2018/02/18/node-js-npm/)

***

