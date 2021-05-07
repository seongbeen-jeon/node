const express = require('express');
const User = require('../Schemas/user');
const Comment = require('../Schemas/comment');

const router = express.Router();

router.post('/',async (req,res,next)=>{
  try{
    const comment = await Comment.create({
      commenter : req.body.id,
      comment : req.body.comment,
    });
    console.log(comment);
    const result = await Comment.populate(comment,{path : 'commenter'});
    res.status(201).json(result);
  }catch(err){
    console.error(err);
    next(err);
  }
});
router.route('/:id')
  //PATCH / 는 HTTP 메서드로 부분적인 수정을 말합니다. PUT은 모든 부분을 수정하기 때문에 차이가 있습니다.
  .patch(async (req,res,next)=>{
    try{
      const result = await Comment.update({
        _id : req.params.id,
      },{
        comment : req.body.comment,
      });
      res.json(result);
    }catch(err){
      console.error(err);
      next(err);
    }
  })
  .delete(async (req,res,next)=>{
    try{
      const result = await Comment.remove({
        _id : req.params.id,
      });
      res.json(result);
    }catch(err){
      console.error(err);
      next(err);
    }
  });

module.exports = router;
