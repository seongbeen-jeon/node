# 몽구스 

몽구스는 NoSQL인 몽고디비를 js 객체와 매핑 시켜주는것이기 때문에 ORM이 아닌 ODM(Object Document Mapping)이라 불립니다.

몽고디비 자체가 자바스크립트인데도 불구하고 몽구스를 사용하는 이유는 몽고디비에서 없어서 불편한 기능들을 지원하여 사용하기 위함입니다.

몽구스에는 먼저 스키마(schema)라는 개념이 있습니다. NoSQL에서는 테이블이 존재하지 않아 어떤 데이터든 저장할 수 있어 확장성과 가용성이 좋지만 때로는 무슨 데이터가 들어올지 몰라 문제가 생길 수 있습니다. 이러한 문제들을 스키마 개념을 이용하여 필터링을 통해 해결합니다.

또한 RDBMS의 JOIN기능에 상응하는 populate라는 메서드가 있습니다. 이를통해 어느정도 JOIN을 흉내낼 수 있습니다.

ES6의 프로미스 문법과 강력하고 가독성이 높은 쿼리빌더를 사용하는것도 몽구스의 장점입니다.

## 몽고디비 연결하기

몽구스를 이용하여 몽고디비와 연결을 해보겠습니다. 몽고디비는 주소를 사용하여 연결합니다. 주소형식은 아래와 같습니다.
mongodb://[username:password@]host[:port][/[database][?options]]
[]부분은 option이기 때문에 없어도 가능합니다. 

코드는 shecmas/index.js 에 있습니다.

## 스키마 정의하기

시퀄라이즈에서 테이블을 매핑한것 처럼 몽구스에서도 비슷한 작업을 해줘야 합니다.
schemas 폴더에 users.js와 comments.js 파일을 만들어 User 모델과 Comment 모델을 만들어줍니다.

몽구스 모듈에서는 Schema 생성자를 사용하여 스키마를 만듭니다. 몽구스는 알아서 _id를 PK로 생성하기때문에 _id 필드는 명시할 필요가 없습니다.

몽구스 스키마에서 특이한 점은 String, Number, Date, Mixed, ObjectID 등 몽고디비와 조금 다른 자료형을 값으로 가질 수 있다는 점입니다.
코드의 마지막에 mongoose.model 메서드를 통해 스키마와 몽고디비 컬렉션을 연결하는 모델을 만듭니다.

코드는 ```schemas/user.js``` 와 ```schemas/comment.js``` 에 있습니다.

schemas/comment.js에서 commenter 속성에 자료형이 ObjectId 입니다. 또한 ref 속성값이 User로 되어있는데 이는 commenter 필드에 User 스키마의 사용자 ObjectId가 들어간다는 의미입니다. 이는 몽구스가 JOIN과 비슷한 기능을 할 때 사용됩니다.

**컬렉션 이름 바꾸기**
몽구스는 model 메서드의 첫 번째 인수로 컬렉션 이름을 만듭니다. 첫번째 인수가 User라면 첫 대문자를 소문자로 바꾸고 복수형으로 바꿉니다.
User -> users, Comment-> comments 가 됩니다. 이러한 강제 개명이 싫다면 model 메서드의 세번째 인수로 컬렉션이름을 부여하면 됩니다.
model("User",userSchema,'user_table'); 이제 users 컬렉션 대신 user_table 컬렉션이 생성됩니다.

## 쿼리 수행하기

몽구스를 사용해서 쿼리를 처리하겠습니다.

views 폴더와 public 폴더는 책에서 제공하는 코드를 복사해왔습니다.

1. route/
GET / 와 GET /users 둘 다 사용자에 대한 데이터를 조회하지만 GET / 는 메인화면을 위해 바로 렌더링을 하고 GET /users는 json으로 반환한다는 차이가 있습니다.

2. route/users
```Post /users```
사용자를 등록할 때는 먼저 <모델>.create 메서드를 사용합니다. 정의한 스키마에 부합하지 않는 데이터를 넣었을 경우 몽구스가 에러를 발생시킵니다. _id는 자동으로 생성되기 때문에 따로 명시하지 않습니다.

```Get /users/:id/comments```
해당 라우터는 사용자가 작성한 댓글을 읽어오는 기능입니다. <model>.find({options}) 메서드에 옵션으로 검색을 원하는 유저를 특정할 필드값을 넣고 검색을 한뒤 populate 메서드를 통해 관련있는 컬렉션의 다큐멘트를 불어옵니다.

comments를 검색하는 것이니 Comment 모델을 사용합니다. Comment 스키마의 comments 필드가 ref로 User로 되어 있기 때문에 populate가 알아서 users컬렉션에서 사용자 다큐먼트를 찾아 합칩니다.
populate 메서드가 동작하면 comments의 commeneter 필드가 user로 알아서 치환됩니다. 이제 commenter 필드는 ObjectId가 아닌 해당 값을 지닌 users모델의 다큐먼트가 됩니다.

populate는 몽구스에서 제공하는것이기 때문에 js단에서 동작합니다. 따라서 성능이 그닥 좋지않고 중복될 시 문제를 일으킬 수 있습니다. 또한 NoSQL을 사용하는 장점이 줄어들 수 있으니 잘 생각하며 사용하여야 합니다.

3. route/comments
```POST / comments```
Comment.create 메서드를 이용하여 댓글을 등록합니다. 그 후 populate 메서드로 프로미스의 결과로 바환된 comment 객체에 다른 컬렉션 다큐먼트를 불러옵니다. POST /users/:id/comments 의 populate와 인자가 조금 다른데 users/:id/comments는 프로미스로 불러올때 populate를 하였기에 객체를 명시하지 않아도 되었지만 POST /comments/ 에서는 이전에 이미 불러온 상태이기 때문에 해당 객체를 명시해준것입니다.


```PATCH /comments/:id```
해당 라우터는 다큐먼트를 업데이트하는 라우터입니다. update 메서드의 첫번째 인수는 어떤 다큐먼트를 수정할 지 정해주고 두번째 인수는 해당 내용으로 수정함을 알려줍니다. 

```DELETE /comments/:id```
해당 라우터는 다큐먼트르 삭제하는 라우터입니다. remove메서드를 이용하여 첫번째 메서드는 어떤 다큐먼트를 삭제할 지 정해줍니다.

---
이제 애플리케이션을 만들기 위한 준비는 끝났습니다.
아직 로그인 구현, 이미지 업로드, JWT 토큰 인증, 실시간 데이터전송, 외부 API 사용등은 앞으로 배워가야 할 이슈들입니다.

## 에러

1. OverwriteModelError
앱을 실행할때 ```OverwriteModelError: Cannot overwrite `Comment` model once compiled.``` 에러가 발생하였습니다.
이미 존재하는 모델을 다시 생성해서 생기는 에러입니다. 왜 인지 살펴보니 Schemas/comment, Schemas/user 이 모델을 생성하는 파일인데 한번 부를때마다 모델이 생성되었기에
여러번 부르면 모델을 중복생성하여 문제가 발생하였습니다.

**해결 방법**
모듈을 exports 할때 모델을 생성하였으니 이미 모델이 존재하면 생성하는것이 아니고 이미 존재하는 모듈을 exports 하게끔 바꿔주었습니다.

module.exports = mongoose.models.User || mongoose.model.User('User',userSchema);
module.exports = mongoose.models.Comment || mongoose.model.Comment('Comment',commentSchema);

2. 클라이언트 무한 로딩
클라이언트에서 서버로 접속할 때 res를 계속 기다립니다.

