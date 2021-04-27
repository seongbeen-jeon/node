const express = require('express');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

router.route('/')
  .get(async(req,res,next)=>{
    try{
      const users = User.findAll();
      res.json(users);  
    }catch (err) {
      console.error(err);
      next(err); 
    }
  })
  .post(async(req,res,next)=>{
    try{
      const user = await User.create({
        name : req.body.name,
        age : req.body.age,
        married : req.body.married
      });
      console.log(user);
      res.status(201).json(200);
    }catch(err){
      console.error(err);
      next(err);
    }
  });

router.get('/:id/comments',async (req,res,next)=>{
  try{
    const comments = Comment.findAll({
      include:{
        model : User,
        where : {id:req.params.id}
      }
    });
    console.log(comments);
    res.json(comments);
  }catch(err){
    console.error(err);
    next(err);
  }
});


module.exports = router;