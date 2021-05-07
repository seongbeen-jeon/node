const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

router.get('/',async (req,res,next)=>{
  try{
    const users = await User.find({});
    res.render('mongoose',{users});
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;

/* 
User.find({}) 메서드를 통해 get을 해준뒤 mongoose.html을 렌더링할 때 데이터를 users 변수로 넣어줍니다.
User.find({})는 몽고디비의 db.users.find({})와 같습니다. 
몽구스도 기본적으로 프로미스를 지원하므로 async/await, try/catch를 사용할 수 있습니다.
*/