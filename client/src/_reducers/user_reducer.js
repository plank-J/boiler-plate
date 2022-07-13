import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        
        case LOGIN_USER:
            //...은 위쪽 state를 똑같이 가지고 오는거임, 현재 빈 상태를 가지고 오는 것
            return { ...state, loginSuccess: action.payload }
            break;
        
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        
        case AUTH_USER:
            return { ...state, userData: action.payload }
            break;

        default:
            return state;
    }
}