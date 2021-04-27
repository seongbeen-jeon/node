const express = require('express');
const User = require('../models/user');
const Comment=  require('../models/comment');

const router = express.Router();

router.get('/',async(req,res,next)=>{
  try{
    const users = await User.findAll();
    const comments = await Comment.findAll();
    res.render('sequelize',{users, comments});
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;