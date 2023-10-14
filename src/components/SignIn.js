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
import {useDispatch, useSelector} from "react-redux";
import {setAuth} from "../features/signupSlice";



export default function SignIn() {
    const authValue = useSelector(state => state.auth.auth);
    const dispatch = useDispatch();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const idRef = useRef();
    const pwRef = useRef();

    const signin = async () => {
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
            data : {
                userid : id,
                password : pw,
            }
        });
        if(result.data.result) {
            console.log(result.data);
            console.log('로그인 성공');
            // window.sessionStorage.setItem('auth', result.data.cookie);
            dispatch(setAuth(result.data.cookie));
        } else {
            console.log(result.data);
            console.log('로그인 실패');
        }

    }
    return (
        <>
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
                <_SignInBtn onClick={signin}>Sign Up</_SignInBtn>
            </_SignInDiv>
        </>
    )
}