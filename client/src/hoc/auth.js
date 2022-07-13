import React, { useEffect } from 'react';
import { Axios } from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
    /*
        option 설명 
            null => 아무나 출입이 가능한 페이지
            true => 로그인한 유저만 출입이 가능한 페이지
            false => 로그인한 유저는 출입불가능한 페이지
        
        adminRoute 설명
            관리자만 들어가길 원할 경우 true를 주면 됨
    */

    //BackEnd에 Request를 보내어 현재 상태를 가져와야함
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            
            dispatch(auth()).then(response => {
                console.log(response)

                //상태처리
                //아무나 진입 가능한 페이지, 로그인한 회원만 진입 가능한 페이지, 로그인 한 회원은 진입 못하는 페이지, 관리자만 진입 가능한 페이지 등

                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    //if(option === true) 와 같은 의미
                    if(option) {
                        navigate('/login');
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        navigate('/');
                    } else {
                        if(option === false)
                            navigate('/');
                    }
                }
            })
            
        }, [])

        return (
            <SpecificComponent />
        )
    }
    
    return AuthenticationCheck
}