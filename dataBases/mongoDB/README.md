# 몽고디비

MongoDB는 Mysql과는 조금 다른 DMS입니다.
MySQL은 SQL을 사용하여 사용하는 대표적인 데이터베이스입니다. 반면에 SQL을 사용하지 않는 데이터베이스를 NoSQL이라 부릅니다.
몽고디비는 NoSQL의 대표 주자입니다.

**SQL과 NoSQL의 차이**
|SQL(MySQL)|NoSQL(몽고디비)|
|---|---|
|규칙에 맞는 데이터 입력|자유로운 데이터 입력|
|테이블간 JOIN 지원|컬렌션간 JOIN 미지원|
|안전성, 일관성|확장성, 가용성|
|용어(테이블,로우,컬럼)|용어(컬렉션,다큐먼트,필드)|

**NoSQL의 특징**
1. 고정된 테이블의 없다.
MySQL은 테이블을 선언하여 어떤 데이터가 들어갈지 자료형등을 정의합니다. NoSQL에서는 테이블에 상응하는 컬렉션이란 개념이 있지만 NoSQL은 규칙을 가진 테이블을 정의하지 않습니다.

2.JOIN 기능 미지원
SQL을 사용하는 DB들은 테이블간 관계를 이용할 수 있는 JOIN 기능을 제공하지만 NoSQL은 컬렉션간의 관계를 생각하지 않습니다. 조인 기능을 흉내낼 수 있지만 하나의 쿼리로 여러 컬렉션을 합치는 작업이 항상 가능하지는 않습니다. 동시에 쿼리를 수행하는 경우 간혹 쿼리가 섞여 예상치 못한 결과를 내는 단점이 있습니다.

이러한 단점에도 NoSQL을 사용하는 이유는 확장성과 가용성때문입니다. 더욱 빠른 데이터 입출력과 여러 서버에 쉽게 데이터를 분산할 수 있습니다.

3. 용어
MySQL에서 테이블, 로우, 컬럼이라 부르는것을 NoSQL에서는 컬렉션, 다큐먼트, 필드라고 부릅니다.


이렇듯 SQL과 NoSQL은 서로다른 특징을 가지고 있습니다. 따라서 알맞는곳에 선택적으로 DB를 사용할 수 있습니다. 하나의 앱에 여러 DB를 사용할 수 있는데 예를들어 항공사 예약 시스템의 경우 예약 처리부분은 일관성이 있어야 하므로 MySQL을 사용하고 빅데이터, 메시징, 세션관리등은 몽고디비를 사용할 수 있습니다.

# 몽고디비의 사용

## 설치

몽고디비를 설치하고 설정할 때 mongod 를 이용합니다.
mongod는 MongoDB 시스템을 위한 데몬 프로세스입니다. data Request, managas data access 등을 관리합니다. 

1. 몽고디비를 다운로드 받습니다.
2. 데이터를 저장하기 위한 물리적인 위치를 설정해줍니다. Default는 C:\data 입니다. 따라서 미리 C:\data 폴더를 만들어줘야합니다.
3. 설치를 하고 mongod를 실행시킵니다.

---
몽고디비를 cmd에서 사용하기위해 mongo를 입력하여 접속하려해도 mongod를 먼저 실행시키지 않으면 접속이 안된다. mongod가 몽고디비 서버를 여는거 같다. 더 찾아보자
---

## Database 다루기

Database는 MySQL에서의 DATABASE와 같습니다.

### 생성 : use

```use``` 명령어를 사용하여 데이터베이스를 생성 할 수 있습니다.
생성 후 해당 데이터베이스를 사용하게 됩니다. 이미 같은 이름의 데이터베이스가 존재한면 해당 데이터베이스를 사용합니다. 
```
use <Database_name>
```

```db``` 명령어를 통해 현재 사용중인 데이터베이스를 확인할 수 있습니다.

```show dbs``` 명령어를 사용하여 데이터베이스 리스트들을 확인할 수 있습니다.
show dbs를 사용하였는데 생성한 데이터베이스가 확인되지 않는다면, 해당 데이터베이스에 한건의 다큐먼트도 존재하지 않기 때문입니다.
```

```
### 제거 : db.dropDatabase()
```db.dropDatabase()```를 사용하여 데이터베이스를 제거합니다.
현재 사용중인 데이터베이스를 제거하기 때문에 use 명령어를 통해 삭제하고자 하는 데이터베이스를 선택해줘야 합니다.

## Collection 다루기

Collection은 MySQL에서 Table에 상응하는 개념입니다.

### 생성 : db.createCollection()

Collection을 생성할때는 db.createCollection(name[,options])명령어를 사용합니다.
```javascript
db.createCollection('users');
// output : { "ok" : 1}

//optional
db.createCollection('articles',{
  capped : true,
  autoIndex : true,
  size : 6142800,
  max : 10000
});
// output : { "ok" : 1}
```

따로 db.createCollection()을 사용하지 않아도 document를 생성하면 자동으로 컬렉션이 생성됩니다.
```
db.users.insert({"name" : "seongbeen"})
```

생성된 Collection을 확인하려면 show collections 명령어를 사용합니다.
```
> show collectinos
users
acrticles
```

### 제거 : db.<collection_name>.drop()

컬렉선을 제거할 때는 drop()를 사용합니다. 현재 사용중인 데이터베이스에서 제거하기 때문에 제거를 원하는 컬렉션이 존재하는 데이터베이스를 use 명령어를 통해 사용한뒤 컬렉션을 제거해야 합니다.

```
> use test
switched to db test
> show collections
users
articles
> db.users.drop()
true
> show collections
articles
```

## document 다루기
### 생성 : db.<collection_name>.insert(document)


몽고디비에서는 컬렉션의 필드를 정의하지 않아도 되기 때문에 아무 데이터나 넣을 수 있습니다. 이러한 자유로움이 몽고디비의 장점입니다. 하지만 어떤 데이터가 들어올지 모른다는 단점도 있습니다.

몽고디비의 자료형은 MySQL과 다릅니다. 기본적으로 Js의 문법을 사용하기 때문에 Js의 자료형을 따릅니다. 추가로 몇몇 자료형도 있습니다.

Date나 regex같은 자바스크립트 객체를 자료형으로 사용할 수 있고 Binary Data, ObjectId, int, Long, Decimal, Timestamp, JavaScript 등의 자료형이 있습니다.
추가된 자료형은 Primary Key로 쓰이는 ObjectId와 BinaryData, Timestamp 외에는 잘 사용하지 않습니다.

```
db.users.insert({name: 'seongbeen', age : 24, married: false, comment: 'Hello MongoDB', createdAt : new Date()});
```
응답으로는 생성 성공한 다큐먼트의 개수가 옵니다.

## 검색 : db.<collection_name>.find()

컬렉션의 다큐먼트 리스트를 확인할때 db.<collection_name>.find()를 사용합니다.
find() 함수에는 2가지의 인자가 들어가는데 첫번째는 조건, 두번째는 읽어올 필드의 목록입니다.

```
db.users.find({'name' : 'seongbeen'},{'age' : 1, 'married' : 1 })
```
위와 같이 사용하면 name이 seongbeen인 다큐먼트의 age필드와 married필드의 정보를 가져오게됩니다.

## 제거 : db.<collection_name>.remove(criteria[,justOne])

다큐먼트를 제거할 때는 remove() 메소드를 사용하게 됩니다. 이 메소드에는 두가지의 매개변수가 있습니다.

첫번째 criteria 매개변수는 삭제 할 데이터의 기준 값입니다. MySQL의 WHERE에 상응합니다. 만약 criteria 매개변수가 비어있다면 해당 컬렉션의 모든 다큐먼트가 제거됩니다.
두번째 justOne 매개변수는 하나의 다큐먼트만 지울것인지 확인하는용도입니다. default는 false입니다.

remove() 메서드는 criteria를 위해 주로 find()와 같이 사용됩니다.