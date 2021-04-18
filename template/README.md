# Template

템플릿 엔진을 사용하여 js로 html을 다루는 방법을 알아보겠습니다.

대표적인 템플릿 엔진으로는 Pug(jade)와 Nunjucks, ejs가 있습니다.

## Nunjucks

넌적스는 firefox를 만든 모질라에서 만들었습니다. HTML 문법을 그대로 사용하되 추가로 js 문법을 사용할 수 있습니다.

**install**
```
npm i nunjucks
```
js 파일에서 연결하는 방법입니다.


```javascript
//app.js

const nunjucks = require('nunjucks');

nunjucks.configure('views',{
  express : app,
  watch : true
});
```

configure의 첫 번째 인수로 views 폴더의 경로를 넣고, 두번 째 인수로 옵션을 넣습니다. express 속성에 app 객체를 연결합니다. watch 옵션이 true면 HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링 합니다.

확장자는 html을 사용해도 됩니다. 하지만 해당 파일이 넌적스를 사용한다는 것을 구분하려면 view engine은 njk으로 바꿔야 합니다.

### 문법 

1. **변수**

res.render 호출 시 보내는 변수를 넌적스가 처리합니다.

```javascript
router.get('/',(req,res,next)=>{
    res.render('index',{title : 'express'});
})
```

넌적스
```html
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>
<button class="{{title}}" type="submit">전송</button>
<input placeholder="{{title}} 연습"/>
```

넌적스에서는 변수를 {{}}로 감쌉니다.

내부에서도 변수를 선언하여 사용할 수 있습니다. 변수를 선언할 때는 {{% set 변수 = '값' %}}를 사용합니다.

```html
{{% set node = 'Node.js'%}}
{{% set js = 'Javascript'%}}
```

2. **반복문**

넌적스에서는 js 문법을 사용하기 위해서는 {% %} 안에 넣으면 됩니다.

반복문을 사용할 때는 반복하고 싶은 값을 for in 문과 endfor 사이에 위치하면 됩니다.

```html
<ul>
  {% set fruits = ['사과', '배', '오렌지']%}
  {% for item in fruits%}
  <li>{{item}}</li>
  {% endfor %}
</ul>
```

3. **include**

넌적스에서는 다른 HTML 파일을 넣을 수 있습니다.

헤더나 푸터, 네비게이션 처럼 여러 페이지에서 공통되는 부분을 따로 관리할 수 있어 관리를 편리하게 할 수 있습니다.

```html
//header.html
<header>
  <a href="/">Home</a>
  <a href="/about">About</a>
</header>
```
```html
//footer.html
<footer>
  <div>푸터입니다.</div>
<footer>
```
```html
//main.html
{% include "header.html"%}
<main>
  <h1>메인 파일</h1>
  <p>다른 파일을 include할 수 있습니다.</p>
</main>
{% include "footer.html" %}
```

4. **레이아웃**

레이아웃을 정해 공통되는 레이아웃 부분을 따로 관리할 수 있습니다.

```html
//layout.html
<!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title>
    <link rel='stylesheet' href='/style.css'/>
    {% block style %}
    {% endblock %}
  </head>  
  <body>
    <header>헤더입니다.</header>
    {% block style %}
    {% endblock %}
    <footer>푸터입니다.</footer>
    {% block content %}
    {% endblock %}
  </body>
</html>
```

```html
//body.html
{% extends 'layout.html'%}

{% block content %}
<main>
  <p>내용입니다.</p>
</main>
{% endblock %}

{% block style%}
<script src='/main.js'></script>
{% endblock %}
```

레이아웃을 설정할 때는 ```{% block [블록명]%}```을 사용합니다. 위에서는 style이라는 이름의 블록과 content 라는 이름의 블록을 사용하여 레이아웃을 작성했습니다. 또한 본문에서는 ```{% extends `레이아웃 경로`%}``` 을 사용하여 레이아웃을 가져옵니다.

나중에 express에서 ```res.render('body')```를 사용하여 하나의 HTML로 합친 후 렌더링 할 수 있습니다.