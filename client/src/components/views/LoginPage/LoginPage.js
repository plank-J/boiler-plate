import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import Auth from '../../../hoc/auth';

function LoginPage() {
  const dispatch = useDispatch(); //redux 사용시 dispatch를 통해 action을 하기 위한 변수
  const navigate = useNavigate(); //props.history.push('/') 가 안먹혀서 추가된 것(v6이후 변경된 문법)

  //메일, 패스워드를 타이핑 하면 아래의 State가 바뀌게 되고 input 안의 value값도 바뀌게 됨
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    //없을 경우 버튼을 누르면 페이지가 refresh됨, 막기위해 선언
    event.preventDefault();

    //State에 보낼 값을 가지고 있기에 가능
    //console.log('Email', Email);
    //console.log('Password', Password);

    let body = {
      email: Email,
      password: Password
    }

    //axios로 보낼 수 있지만 redux 사용을 위한 dispatch사용
    dispatch(loginUser(body))
      .then(response => {
        //로그인이 성공할 경우 랜딩페이지로 바로 이동
        if(response.payload.loginSuccess) {
          //props.history.push('/')
          navigate('/');
        } else {
          alert('Error');
        }
      })

  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={ onSubmitHandler }>
        
        <label>Email</label> 
        <input type="email" value={ Email } onChange={ onEmailHandler } />
        
        <label>Password</label>
        <input type="password" value={ Password } onChange={ onPasswordHandler } />
        
        <br />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default Auth(LoginPage, false)