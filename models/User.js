const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;    //salt 글자 수 지정
const jwt = require('jsonwebtoken');    //token 생성을 위함

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

//저장하기전에 작동
userSchema.pre('save', function( next ){
    //userScema의 password를 가져오기 위한 변수 생성
    var user = this;

    //스키마가 바뀔때마다 비밀번호를 암호화 하는것이 아니므로(비밀번호가 바뀔경우만 암호화) 조건 부여
    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        //salt를 통해 암호화를 시킬 예정이므로 먼저 salt를 생성
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            
            //성공할 경우 암호화 비밀번호 생성
            //hash는 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                
                user.password = hash;
                next();
            });
            
        });

    } else {
        next();
    }

});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 12345 암호화된 비밀번호 $2b$10$Evm7LG.kUTTa7XEhtTJaq.wNL0kj5TzYDILuPZhg01zIf8stmoxvC 가 같은지 체크
    //결국 plainPassword를 암호화해서 같은지 체크해야함(뒤 암호화된 비밀번호를 복호화 할 순 없음)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })

}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    
    //jsonwebtoken을 이용해서 token을 생성하기
    // user._id + 'secretToken' 으로 token을 생성하고 후에 token 분석시 secretToken을 넣으면 user._id를 얻을 수 있는 방식
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
            cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //토큰을 decode 한다. (generateToken에서 지정한 secretToken을 넣어주면 됨)
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음, 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

//Model은 Schema를 감싸줘야함
const User = mongoose.model('User', userSchema)

//다른곳에서도 쓸수있게 User를 export
module.exports = { User }