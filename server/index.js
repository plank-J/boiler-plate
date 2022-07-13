const express = require('express');  //express 모듈을 가져옴(package.json dependencies에서 설치한 express)
const app = express();   //function을 이용해 새로운 express app을 만듦
const port = 5000;
const config = require('./config/key'); //아래 mongo DB 연결의 정보를 git에 올릴시 숨기기위해 key를 호출하는 형식으로 바꿈
const bodyParser = require('body-parser');  //body-parser : client에서 오는 정보를 server에서 분석할 수 있게 해주는 것
const cookieParser = require('cookie-parser');  //cookie-parser : 생성된 Token을 웹브라우저 쿠키에 저장하기 위함
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//bodyParser 옵션 부여
app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-urlencoded 왼쪽 형태의 데이터를 분석해서 가져올 수 있게 해주는 옵션
app.use(bodyParser.json()); //application/json 왼쪽 형태의 데이터를 분석해서 가져올 수 있게 해주는 옵션
app.use(cookieParser());  //cookieParser 옵션 부여

//mongoose DB 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true//, useCreateIndex: true, useFindAndModify: false -> 옵션 주는 부분
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => { res.send('Hello World! 안녕하세요! 바뀌었습니다!') });  //루트 디렉토리에 오면 Hello World를 출력

app.get('/api/hello', (req, res) => {
  res.send("리액트 실행 완료~");
})

app.post('/api/users/register', (req, res) => {
  //회원 가입 시 필요 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body); //req.body에는 json 형식으로 데이터가 들어가 있음 ex. { id: hello, pass: 1234 }
  
  //저장 전 암호화
  //--> User.js에서 save 전 작동

  //정보들이 user 정보에 저장됨(save는 mongo db에서 온 메서드)
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})  //실패시 에러메세지 표시
    return res.status(200).json({success: true})  //status(200) : 성공했다는 표시
  }); 

});

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.(findOne의 경우 몽고DB의 메소드)
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 같은지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

      //비밀번호 까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //토큰을 쿠키 또는 로컬스토리지 등에 저장한다. 안정성에 관련해서는 논의가 많음(여러가지 방법이 있음)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id});  //200은 성공 표시
      })

    })

  })
 
})

//가운데 auth 설명 : 호출시 cb(req, res) 받기 전에 중간(middleware)에서 작동
app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 것은 Authentication이 true 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,  //role = 0 => 일반유저 아니면 관리자 식으로 짜는 중, 바꿀 수 있음
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

//로그아웃의 경우 클라이언트에서 가져온 토큰을 DB에서 비교하는 과정 중 DB쪽 토큰을 삭제하면 맞지않아 로그인이 풀리는 방식으로
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate ({ _id: req.user._id },
    { token: "" },
    (err, user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => { console.log(`Example app listening on port ${port}`) });