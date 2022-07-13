import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import "antd/dist/antd.css";
import Auth from '../../../hoc/auth';

function LandingPage() {
    //LandingPage를 시작하자마자 useEffect를 실행
    useEffect(() => {
        //서버에 get방식으로 api/hello를 보내서 받아온 response를 출력
        axios.get('/api/hello')
        .then(response => console.log(response.data))
    }, [])
    
    const navigate = useNavigate();

    const onRegisterHandler = () => {
        navigate('/register');
    }
    
    const onLoginHandler = () => {
        navigate('/login');
    }

    const onLogoutHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if(response.data.success) {
                    navigate('/login');
                } else {
                    alert('로그아웃을 실패했습니다.');
                }
            })
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'}}>
            <form style={{ display: 'flex', flexDirection: 'column' }}>
                <h2>시작페이지</h2>
        
                <Button type={'primary'} onClick={ onRegisterHandler }>회원가입</Button>
                <br />
                <Button type={'primary'} onClick={ onLoginHandler }>로그인</Button>
                <br />
                <Button type={'primary'} onClick={ onLogoutHandler }>로그아웃</Button>
            </form>
        </div>
    )
}

export default Auth(LandingPage, null)