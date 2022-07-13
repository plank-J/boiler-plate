//환경변수를 받아옴(node_env) : 로컬일때는 직접 mongo db 아이디/비번을 줘서 실행해야하고 배포된 상황에선
//호스팅하는 페이지에 직접 입력해놓기 때문에 환경변수 즉 실행환경에 따라 다르게 가져옴
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}