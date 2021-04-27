# 시퀄라이즈(Sequelize)

시퀄라이즈는 주로 노드에서 RDBMS을 다루기 위해 사용되는 라이브러리 입니다. 시퀄라이즈는 RDB를 다루기 때문에 ORM(Object-Relational Mappling)으로 분류됩니다. ORM은 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구 입니다.

시퀄라이즈는 MariaDB, PostgreSQL, SQLite, MSSQL등 다른 DB와도 사용할 수 있으며 문법이 어느 정도 호환되므로 프로젝트를 다른 SQL 데이터베이스로 전환할 때도 편리합니다.

시퀄라이즈를 사용해주기 위해서는 sequelize, sequelize-cli, mysql2 모듈을 설치합니다. sequelize-cli는 명령어를 실행하기 위한 패키지이고, mysql2는 mysql과 시퀄라이즈를 연결하는 드라이버입니다.

## 시퀄라이즈 사용하기

### 설정하기
설치완료후 init을 통해 시퀄라이즈를 사용할 준비를 합니다. 전역 설치 없이 명령어로 사용하기 위해서는 앞에 npx를 붙여줍니다.
```
//콘솔
$ npx sequelize init
```

config, models, migrations, seeders 폴더가 생성되었습니다. models/index.js는 sequelize-cli가 자동으로 생성해주는 코드가 있지만 그대로 사용하면 필요없는 부분이 있을 수 있습니다.
 
config/config.json에서는 데이터 베이스의 설정을 가져와 new Sequelize를 통해 MySQL 연결 객체를 생성합니다.


### 연결하기
new Sequelize를 통해 만든 연결객체로 express앱과 MySQL을 연결합니다.

코드는 app.js에 있습니다.

require(models)를 사용하여 models/index를 불러옵니다. index는 생략해도 됩니다. db.sequelize를 불러와서 sync 메서드를 사용해 서버 실행 시 MySQL과 연동되도록 했습니다.
내부에 force: false 옵션이 있는데 해당 옵션은 서버 실행 시 마다 테이블을 재생성합니다. 테이블을 잘못 만든 경우에 true로 설정합니다.

연결시 config/config.json의 정보가 사용됩니다. 본인의 DB에 접속할 수 있도록 정보를 수정해줍니다.


### 모델 정의하기
데이터베이스에서 정의한 테이블을 시퀄라이즈에서도 정의를 해야합니다. 시퀄라이즈는 app과 mysql를 연결 시켜 주는것이기 때문에 DB의 테이블과 시퀄라이즈의 모델은 서로 대응됩니다.

시퀄라이즈는 기본적으로 모델 이름은 단수형으로, 테이블 이름은 복수형으로 사용됩니다.

/models에 user.js에 User에 대한 코드가 있습니다.

User 모델을 만들고 모듈로 exports 했습니다. 모델을 만들때는 Sequelize.Model을 확장한 클래스로 선언합니다.
모델은 크게 static init()과 static associate()로 나뉩니다.

init 메서드는 테이블에 대한 설정을 하고, associate 메서드는 다른 모델과의 관계를 적습니다.

모델을 생성하였다면 models/index.js와 연결합니다.

**연결 과정**
1.db라는 객체에 User와 Comment 모델을 담아두었습니다. 앞으로 db 객체를 require하여 User, Comment 모델에 접근할 수 있습니다.
2.User.init, Comment.init은 각각의 static.init을 실행시킵니다. init이 실행 되어야 테이블이 모델로 연결됩ㄴ디ㅏ.
3.다른 테이블과의 관계를 연결하는 associate 메서드도 미리 실행해둡니다.


### 관계 정의하기 

위에서 User와 Comment 모델을 정의하여 테이블과 연결하였으니 해당 테이블 간의 관계를 정의해보겠습니다. 테이블간의 관계에는 3가지 유형이 있습니다.

1. 1:N 관계
일대다 관계의 예로는 사용자 : 댓글 등이 있습니다. 한사람이 여러 댓글을 달 수는 있지만 하나의 댓글을 여러명이 달 수 없는 것이 이러한 관계입니다.

시퀄라이즈에서는 이러한 관계를 hasMany라는 메서드로 표현 합니다. users테이블의 로우 하나를 불러올때 해당 로우에 연결된 여러 comment 로우를 불러 올 수 있습니다. 반대로 댓글에서 사용자를 불러올 때는 belongsTo 메서드를 사용합니다.

2. 1:1 관계 
1:1 관계의 예로는 사용자와 사용자정보를 담고있는 테이블을 예로 들 수 있습니다.

```javascript
db.User.hasOne(db.Info,{foreignKey:'UserID', sourceKey:'id'});
db.Info.belongsTo(db.User,{foreignKey:'UserID',sourceKey:'id'});
```

1:1 관계라 해도 반대로 사용하면 안됩니다. belongsTo 메서드를 사용하는 모델에 foreignKey인 UserID 컬럼이 생성되기 때문입니다.

3. N:M 관계
다대다 관계로는 게시글과 태그로 예를 들수 있습니다. 하나의 게시글에 여러개의 태그가 올 수 있고 하나의 태그를 여러개의 게시글에서 작성할 수 있기 때문입니다.

시퀄라이즈에서는 N:M 관계를 표현할 때 belongsToMany 메서드를 사용합니다.
```javascript
db.Post.belongsToMany(db.Hashtag, {through : 'PostHashtag'});
db.Hashtag.belongToMany(db.Post,{through:'PostHasgtag'});
``` 

N:M 관계에서는 데이터를 조회할 때 여러 단계를 거쳐야합니다. through로 사용한 PostHashtag ㅔ이블을 통해 접근하기 때문입니다.


## 쿼리 생성하기

위에서 설정과 연결을 해보았으니 이제 시퀄라이즈를 통해 DB에 쿼리를 날리는것을 알아보겠습니다.

SQL문은 Js로 생성하는것이 아니라 시퀄라이즈만의 방식으로 생성합니다. 쿼리는 프로미스를 반환하므로 then을 붙여 결괏값을 받을 수 있습니다.

1. INSERT INTO
```
SQL : 
INSERT INTO nodejs.users (name,age,married,comment) VALUES ('ZERO', 24, 0, '자기소개1');

Sequelize :
const {User} = require('../models');
User.create({
  name: 'zero',
  age:24,
  married:false,
  comment:'자기소개1'
});
```

시퀄라이즈에서 쿼리를 생성할 때 한가지 주의해야 할 점은 데이터를 넣을때 MySQL의 자료형이 아니라 시퀄라이즈 모델에 정의한 자료형대로 넣어야 합니다.

2. SELECT FROM
```javascript
1. SELECT * FROM <db>
SQL :
SELECT * FROM nodedjs.users;

Sequelize:
User.findAll({});

2. SELECT * FROM <db> LIMIT
SQL :
SELECT * FROM nodejs.users LIMIT 1;

Sequelize:
User.findOne({});

3. SELECT <columns> FROM <db>
SQL :
SELECT name, married FROM nodejs.users;

Sequelize:
User.findAll({
  attributes : ['name','married'];
});

4. SELECT <columns> FROM <db> WHERE <Condition>
SQL :
SELECT name, married FROM nodejs.users WHERE married=1 AND age > 30;

Sequelize :
const {Op} = require('sequelize');
const {User} = require('../models'); // where 문에 사용되는 정의된 속성을 사용하기 위해서라고 추측된다.
User.findAll({
  attributes : ['name','married'],
  WHERE : {
    married : true,
    age : {[Op.gt]: 30}
  }
});

```

시퀄라이즈는 Js Object를 사용해서 쿼리를 생성해야 하므로 Op.gt 같은 특수한 연산자들이 나오는데 이는 Sequelize객체 내부의 Op 객체에 존재합니다.

이러한 연산자들 외에 다른 옵션들을 넣어 사용할 수 있는 수많은 쿼리들이 있습니다. 


### 관계 쿼리

또한 시퀄라이즈는 관계 쿼리를 지원합니다. 이는 MySQL의 JOIN과 같은 기능을 하는 메서드입니다. 시퀄라이즈에서 include속성을 사용하여 join 기능을 사용할 수 있습니다.

현재 models/index에서 User 모델과 Comment 모델을 연결 하였고, 각각의 모델에서 associate()를 통해 관계를 정의하였습니다. 

### SQL 쿼리

시퀄라이즈의 쿼리를 사용하지 않고 직접 SQL문을 사용하여 쿼리할 수도 있습니다.

```
const [result, metadatal] = await sequelize.query('SELECT * FROM comments');
console.log(result);
```

시퀄라이즈 쿼리로 할 수 없는 경우에 위와 같이 SQL 쿼리를 사용하면 됩니다.