import {motion} from "framer-motion";
import {
    _IdInput,
    _NickNameInput,
    _PasswordInput, _SignInBtn,
    _SignInDiv,
    _SignUpBtn,
    _SignUpDiv
} from "../styledComponents/SignUpComponents";
import {useRef, useState} from "react";
import axios from "axios";
import {indexStore} from "../zustand/store";
import { useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom";


export default function SignIn() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const localUrl = process.env.REACT_APP_LOCAL_URL;
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const {userIndex, setUserIndex} = indexStore();
    const idRef = useRef();
    const pwRef = useRef();
    const loginFailAlarm = useRef();
    const { handleSubmit } = useForm();
    const unsubscribe = indexStore.subscribe(userIndex => console.log('setUserIndex : ', userIndex), state => state.userIndex);
    const navigate = useNavigate();
    const onValid = async () => {
        if(id === '') {
            idRef.current.focus();
            return;
        }
        if(pw === '') {
            pwRef.current.focus();
            return;
        }
        const result = await axios({
            method : 'POST',
            url : `${apiUrl}/user/signin`,
            // url : 'http://localhost:8001/user/signin',
            data : {
                userid : id,
                password : pw,
            }
        });
        if(result.data.result) {
            const index = result.data.user.id;
            window.localStorage.setItem('auth', result.data.cookie);
            setUserIndex(index);
            navigate('/');
        } else {
            console.log(result.data);
            loginFailAlarm.current.textContent = 'You have entered an incorrect username or password.';
        }

    }
    return (
        <>
            <form onSubmit={handleSubmit(onValid)}>
                <_SignInDiv as={motion.div}
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
                    <h1 style={{ textAlign : "center" }}>Sign In</h1>
                    <h3>ID</h3>
                    <_IdInput ref={idRef} onChange={(e)=>setId(e.target.value)}></_IdInput>
                    <h3>Password</h3>
                    <_PasswordInput ref={pwRef} onChange={(e)=> setPw(e.target.value)} type="password"></_PasswordInput>
                    <h3 style={{ color : "red" }} ref={loginFailAlarm}></h3>
                    <_SignInBtn type="submit">Sign In</_SignInBtn>
                </_SignInDiv>
            </form>
        </>
    )
}