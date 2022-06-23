const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,     //email의 공백 삭제
        unique: 1       //중복 이메일 방지
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {             //권한 부여
        type: Number,
        default: 0
    },
    image: String,      //오브젝트 사용않고 표현가능
    token: {            //유효성 관리시 필요
        type: String
    },
    tokenExp: {         //토큰 유효기간
        type: Number
    }

})

//Model은 Schema를 감싸줘야함
const User = mongoose.model('User', userSchema)

//다른곳에서도 쓸수있게 User를 export
module.exports = { User }