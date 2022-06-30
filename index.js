const express = require('express');  //express 모듈을 가져옴(package.json dependencies에서 설치한 express)
const app = express();   //function을 이용해 새로운 express app을 만듦
const port = 5000;

const bodyParser = require('body-parser');  //body-parser : client에서 오는 정보를 server에서 분석할 수 있게 해주는 것
const { User } = require("./models/User");

const config = require('./config/key'); //아래 mongo DB 연결의 정보를 git에 올릴시 숨기기위해 key를 호출하는 형식으로 바꿈

//bodyParser 옵션 부여
app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-urlencoded 왼쪽 형태의 데이터를 분석해서 가져올 수 있게 해주는 옵션
app.use(bodyParser.json()); //application/json 왼쪽 형태의 데이터를 분석해서 가져올 수 있게 해주는 옵션

//mongoose DB 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true//, useCreateIndex: true, useFindAndModify: false -> 옵션 주는 부분
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => { res.send('Hello World! 안녕하세요! 바뀌었습니다!') });  //루트 디렉토리에 오면 Hello World를 출력

app.post('/register', (req, res) => {
  //회원 가입 시 필요 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body); //req.body에는 json 형식으로 데이터가 들어가 있음 ex. { id: hello, pass: 1234 }
  
  //정보들이 user 정보에 저장됨(save는 mongo db에서 온 메서드)
  user.save((err, userInfo) => {
     
    if(err) return res.json({success: false, err})  //실패시 에러메세지 표시
    return res.status(200).json({success: true})  //status(200) : 성공했다는 표시
  }); 

});

app.listen(port, () => { console.log(`Example app listening on port ${port}`) });