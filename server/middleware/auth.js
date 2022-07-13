const { User } = require('../models/User');

//인증 처리를 하는 곳
let auth = (req, res, next) => {
    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //토큰을 복호화(decode) 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next(); //넥스트가 없을경우 미드웨어에서 갇혀 진행이 안되기 때문에 그 뒤를 갈 수 있게 넥스트를 기입
    })

    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 No
}

module.exports = { auth };