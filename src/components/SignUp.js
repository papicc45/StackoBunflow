import {
    _IdInput, _NickNameInput,
    _PasswordInput, _SignUpBtn,
    _SignUpDiv,
} from "../styledComponents/SignUpComponents";
import {useEffect, useReducer, useRef, useState} from "react";

import axios from 'axios';
import { motion } from "framer-motion";

const initialState = {
    id : '',
    password : '',
    nickname : '',
    idValid : false,
    pwValid : false,
}

function reducer(state, action) {
    switch(action.type) {
        case 'ID_CHECK' :
            const idValue = action.value;
            const idCheck =  /^[a-zA-Z].*/.test(idValue)
            return { ...state,  idValid: idCheck, id :idValue}
        case 'PW_CHECK' :
            const pwValue = action.value;
            const pwCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/.test(pwValue);
            return {...state, pwValid: pwCheck, password : pwValue}
        case 'NICKNAME_CHECK' :
            return { ...state, nickname : action.event.target.value }
        default : throw new Error('invalid action type');
    }
}
export default function SignUp() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [state, dispatch] = useReducer(reducer, initialState);
    const idRef = useRef();
    const pwRef = useRef();
    const nnRef = useRef();

    const signup = async  () => {
        if(!state.idValid) {
            idRef.current.focus();
            return;
        }
        if(!state.pwValid) {
            pwRef.current.focus();
            return;
        }
        if(state.nickname === '') {
            nnRef.current.focus();
            return;
        }
        const result = await axios({
            method : 'POST',
            url : `${apiUrl}/user/signup`,
            data : {
                userid : state.id,
                password : state.password,
                nickname : state.nickname,
            }
        });
        if(result.data.result) {
            console.log('회원가입 성공');
        } else {
            console.log('회원가입 실패');
        }
    }

    return (
        <>
            <_SignUpDiv as={motion.div}
                        animate={{
                            scale: [1, 2, 2, 1, 1],
                            rotate: [0, 0, 180, 180, 0],
                            borderRadius: ["0%", "0%", "20%", "20%", "0%"]
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            times: [0, 0.2, 0.5, 0.8, 1],
                        }}>
                <h1 style={{ textAlign : "center" }}>Sign Up</h1>
                <h3>ID</h3>
                <_IdInput ref={idRef} onChange={(e)=> dispatch({ type : 'ID_CHECK' , value : e.target.value})}></_IdInput>
                {!state.idValid && state.id !== '' && <p style={{ color: 'red' }}> 아이디의 첫번째 글자는 영어 대,소문자를 입력해주세요</p>}
                <h3>Password</h3>
                <_PasswordInput ref={pwRef} onChange={(e)=> dispatch({ type : 'PW_CHECK', value : e.target.value })} type="password"></_PasswordInput>
                {!state.pwValid && state.password !== '' && <p style={{ color: 'red' }}> 영문, 숫자, 특수문자 포함 8자 이상을 입력해주세요</p>}
                <h3>Nickname</h3>
                <_NickNameInput ref={nnRef} onChange={(e)=> dispatch({type : 'NICKNAME_CHECK', event : e})}></_NickNameInput>
                <_SignUpBtn onClick={signup}>Sign Up</_SignUpBtn>
            </_SignUpDiv>
        </>
    )
}