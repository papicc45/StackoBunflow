import {_IdInput, _NickNameInput, _PasswordInput, _SignUpBtn, _SignUpDiv} from "../styledComponents/SignUpComponents";
import {motion} from "framer-motion";
import {useEffect, useReducer, useRef, useState} from "react";
import {_InModalBtn, customModalStyles} from "../styledComponents/ModalComponent";
import {Link, useNavigate} from "react-router-dom";
import Modal from "react-modal";
import axios from 'axios';
import Swal from "sweetalert2";
const initialState = {
    password : '',
    nickname : '',
    idValid : false,
    pwValid : false,
}
function reducer(state, action) {
    switch(action.type) {
        case 'PW_CHECK' :
            const pwValue = action.value;
            const pwCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/.test(pwValue);
            return {...state, pwValid: pwCheck, password : pwValue}
        case 'NICKNAME_CHECK' :
            return { ...state, nickname : action.event.target.value }
        default : throw new Error('invalid action type');
    }
}
export default function MyInfo() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const localUrl = process.env.REACT_APP_LOCAL_URL;
    const [state, dispatch] = useReducer(reducer, initialState);
    const [beforeId, setBeforeId] = useState('');
    const [beforeNickname, setBeforeNickname] = useState('');
    const [modalText, setModalText] = useState('');
    const pwRef = useRef();
    const nnRef = useRef();
    const [modalIsOpen, setIsOpen] = useState(false);
    const auth = window.localStorage.getItem('auth');
    const navigate = useNavigate();
    const getUserInfo = async () => {
        console.log(auth);
        const result = await axios({
            method : "POST",
            url : `${apiUrl}/user/myinfo`,
            headers : { auth },
            data : {},
        });

        if(result.data.result) {
            setBeforeId(result.data.userInfo.userid);
            setBeforeNickname(result.data.userInfo.nickname);
        }
    }
    useEffect(()=> {
        getUserInfo();
    }, []);

    const openModal = (work) => {
        if(work === 'update') {
            setModalText('정보변경 되었습니다 !');
        } else {
            setModalText('회원탈퇴 되었습니다 !');
        }
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    const deleteUser = () => {
        Swal.fire({
            title : '정말 탈퇴하시겠습니까?',
            confirmButtonText : 'Yes',
            showCancelButton : true,
        }).then(async (result)=> {
            if(result.isConfirmed) {
                const result = await axios({
                    method : "DELETE",
                    url : `${apiUrl}/user/delete`,
                    headers : { auth },
                });

                if(result.data.result) {
                    openModal('delete');
                    window.localStorage.removeItem('auth');
                }
            }
        })
    }
    const updateInfo = () => {
        console.log('updateinfo');
        Swal.fire({
            title : '정말 변경하시겠습니까?',
            confirmButtonText : "Yes",
            cancelButtonText : "No",
            showCancelButton : true,
        }).then(async (result)=> {
            if(result.isConfirmed) {
                if (!state.pwValid) {
                    pwRef.current.focus();
                    return;
                }
                if (state.nickname === '') {
                    nnRef.current.focus();
                    return;
                }

                const result = await axios({
                    method: "PATCH",
                    url: `${apiUrl}/user/update`,
                    headers: {auth},
                    data: {password: state.password, nickname: state.nickname}
                })

                if (result.data.result) {
                    openModal('update');
                }
            }
        })
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
                <h1 style={{ textAlign : "center" }}>내 정보</h1>
                <h3>ID</h3>
                <_IdInput placeholder={beforeId} readOnly></_IdInput>
                <h3>Password</h3>
                <_PasswordInput ref={pwRef} onChange={(e)=> dispatch({ type : 'PW_CHECK', value : e.target.value })} type="password"></_PasswordInput>
                {!state.pwValid && state.password !== '' && <p style={{ color: 'red' }}> 영문, 숫자, 특수문자 포함 8자 이상을 입력해주세요</p>}
                <h3>Nickname</h3>
                <_NickNameInput placeholder={beforeNickname} ref={nnRef} onChange={(e)=> dispatch({type : 'NICKNAME_CHECK', event : e})}></_NickNameInput>
                <div style={{ display : "flex" }}>
                    <_SignUpBtn onClick={updateInfo}>정보수정</_SignUpBtn>
                    <_SignUpBtn onClick={deleteUser}>탈퇴하기</_SignUpBtn>
                </div>
            </_SignUpDiv>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customModalStyles}
                contentLabel="Example Modal"
            >
                <h3 style={{ textAlign : "center" }}>{modalText}</h3>
                <div style={{ display : "flex", justifyContent : "space-evenly" }}>
                    <_InModalBtn><Link to="/">메인으로</Link></_InModalBtn>
                    {/*<_InModalBtn><Link to="/signin">로그인</Link></_InModalBtn>*/}
                </div>
            </Modal>
        </>
    )
}