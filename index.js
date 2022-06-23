const express = require('express')  //express 모듈을 가져옴(package.json dependencies에서 설치한 express)
const app = express()   //function을 이용해 새로운 express app을 만듦
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://plank:1q2w3e1234567@youtubecluster.vsq0v.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true//, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => { res.send('Hello World! 안녕하세요!') })  //루트 디렉토리에 오면 Hello World를 출력

app.listen(port, () => { console.log(`Example app listening on port ${port}`) })