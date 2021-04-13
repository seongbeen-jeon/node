const express = require('express');
const app = express();
const dotenv = require('dotenv');

const indexRouter = require('./routes/index'); // index를 생략해도 index.js를 가져올 수 있습니다.
const userRouter = require('./routes/user');

dotenv.config();

app.use('/',indexRouter);
app.use('/user',userRouter);

app.use((req,res,next)=>{
  res.status(404).send('NOT FOUND');
});

app.use((err,req,res,next)=>{
  console.error(err);
  res.send(err);
  process.exit(1);
});

app.listen(process.env.PORT,()=>{
  console.log(`
  ***********************************
  😶Server listening on port : ${process.env.PORT}
  ***********************************
  `);
});