import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from 'axios';
import {
    _AskBtn,
    _Container,
    _Contents,
    _Home,
    _LeftSideBar,
    _MainBar, _RightSideBar,
    _SideLi,
    _SideUl
} from "../styledComponents/QusetionsComponents";
import './pre.css'
import {modules, formats, swalOpen} from "../utils/toolBarOption";
import ReactQuill from "react-quill";
import {indexStore} from "../zustand/store";
import Swal from 'sweetalert2';

export default function QusetionDetail() {
    const [content, setContent] = useState('');
    const {questionId} = useParams();
    const [question, setQuestion] = useState({});
    const [recommendCheck, setRecommendCheck] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const localUrl = process.env.REACT_APP_LOCAL_URL;
    const auth = window.localStorage.getItem('auth');
    const answerRef = useRef();
    const { userIndex } = indexStore();
    const navigate = useNavigate();
    // console.log(userIndex);
    const unsubscribe = indexStore.subscribe(userIndex => console.log('setUserIndex : ', userIndex), state => state.userIndex);
    console.log(auth);
    const handleChange = (value) => {
        setContent(value);
    };

    const getQuestionInfo = async (count) => {
        try {
            const result = await axios({
                method : 'GET',
                url : `${apiUrl}/question?id=${questionId}&count=${count}`
            })
            console.log(result);
            if(result.data.result) {
                setQuestion(result.data.question);
                console.log(result.data.question);
                const answerArr = result.data.question.answer;
                const arr = new Array();
                for(let answer of answerArr) {
                    const answerId = answer.id;
                    let check = false;
                    for(let recommend of answer.recommended) {
                        if(recommend.userId === userIndex)
                            check = true;
                    }
                    arr.push({ answerId : answerId, recommended : check });
                }
                setRecommendCheck(arr);
            }
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(()=> {
        getQuestionInfo(1);
    }, []);



    const givenDate = new Date(question.createdAt);
    const date = `${givenDate.getFullYear()}-${String(givenDate.getMonth() + 1).padStart(2, '0')}-${String(givenDate.getDate()).padStart(2, '0')}`;

    const postAnswer = async () => {
        if(content === '') {
            answerRef.current.focus();
            return;
        }

        const result = await axios({
            method : 'POST',
            url : `${apiUrl}/question/answer`,
            headers : { auth : auth },
            data : { content, questionId : Number(questionId) }
        });
        if(result.data.result) {
           setContent('');
           getQuestionInfo(0);
        }
    }

    const handleRecommend1 = async (answerId, count) => {
        if(auth === null) return;
        console.log('handleRecommend1');
        console.log('answerId: ', answerId);
        console.log('count: ', count);
        console.log('userIndex : ', userIndex);
        const result = await axios({
            method : 'POST',
            url : `${localUrl}/question/recommend`,
            headers : { auth : auth },
            data : { answerId : Number(answerId), count : Number(count) },
        });
        //
        console.log(result);
        if(result.data.result) {
            getQuestionInfo(0);
        }
    }
    const handleRecommend2 = async (answerId, count) => {
        if(auth === null) return;
        console.log('handleRecommend2');
        console.log('answerId: ', answerId);
        console.log('count: ', count);
        console.log('userIndex : ', userIndex);
        const result = await axios({
            method : 'POST',
            url : `${apiUrl}/question/recommend`,
            headers : { auth : auth },
            data : { answerId : Number(answerId), count : Number(count) },
        });
        //
        console.log(result);
        if(result.data.result) {
            getQuestionInfo(0);
        }
    }
    const allQuestions = () => {
        navigate('/questions');
    }
    return (
        <>
            <_Container>
                <_LeftSideBar>
                    <_Home>Home</_Home>
                    <_SideUl>
                        PUBLIC
                        <_SideLi onClick={allQuestions} style={{ backgroundColor : "#F1F2F3", borderRight : "3px solid #E5883E", cursor : 'pointer' }}>Questions</_SideLi>
                        <Link to="/taglist"><_SideLi>Tags</_SideLi></Link>
                        <_SideLi>Users</_SideLi>
                    </_SideUl>
                </_LeftSideBar>
                <_Contents>
                    <_MainBar style={{ width : "1000px" }}>
                        <div style={{ borderBottom : '1px solid lightgray', paddingBottom : '10px' }}>
                            <div style={{ display : "flex", justifyContent : "space-between" }}>
                                <div style={{ fontSize : "30px", fontWeight : 'bold', marginBottom : "5px" }}>{question.title}</div>
                                <_AskBtn>Ask Question</_AskBtn>
                            </div>
                            <span style={{ marginRight : "20px;" }}>Asked : {date}</span>
                            <span style={{ marginLeft : "20px" }}>Viewd : {question.count} times</span>
                        </div>
                        <div style={{ display : "flex", width : "1440px" }}>
                            <div style={{ width : "70%", margin : "3px" }}>
                                <div style={{ borderBottom : "1px solid lightgray", wordBreak : "break-all" }} dangerouslySetInnerHTML={{ __html : question.content }}></div>
                                {question.answer === undefined ? (
                                    <div style={{ fontSize : "20px", margin : "20px 0px 20px 0px" }}>No Answer</div>
                                ) : (
                                    <div style={{ fontSize : "20px", margin : "20px 0px 20px 0px" }}>{question.answer.length} Answer</div>
                                ) }
                                <div>
                                {question.answer !== undefined && question.answer.map((value, idx)=> {
                                    console.log('value.id' , value.id);
                                    console.log('value.recommend' , value.recommend);
                                    let check = false;
                                    if(value.recommended.length !== 0) {
                                        for(let val of value.recommended) {
                                            console.log(`userIndex : ${userIndex}    val.userId : ${val.userId}`)
                                            if(userIndex !== 0 && val.userId === userIndex) {
                                                check = true;
                                            }
                                        }
                                    }
                                    const answerGivenDate = new Date(value.createdAt);
                                    const answerDate = `${answerGivenDate.getFullYear()}-${String(answerGivenDate.getMonth() + 1).padStart(2, '0')}-${String(answerGivenDate.getDate()).padStart(2, '0')}`;
                                    return (
                                        <div style={{ borderBottom : "1px solid lightgray", paddingBottom : "10px" }}>
                                            <div style={{ wordBreak : "break-all" }} dangerouslySetInnerHTML={{ __html : value.content }}></div>
                                            <div style={{ display : "flex"}}>
                                                <div style={{  width : "70%"}}>

                                                    <span>
                                                        {recommendCheck[idx].recommended &&
                                                            <svg style={{ backgroundColor : "skyblue", border : "1px solid skyblue", padding : "3px", borderRadius : "4px", marginBottom : "-5px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                 fill="currentColor" className="bi bi-hand-thumbs-up"
                                                                 viewBox="0 0 16 16" onClick={()=> handleRecommend1(value.id, value.recommend)}>
                                                                <path
                                                                      d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                                                </svg>
                                                        }
                                                        {!recommendCheck[idx].recommended &&
                                                            <svg style={{ border : "1px solid skyblue", padding : "3px", borderRadius : "4px", marginBottom : "-5px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                 fill="currentColor" className="bi bi-hand-thumbs-up"
                                                                 viewBox="0 0 16 16" onClick={()=> handleRecommend2(value.id, value.recommend)}>
                                                                <path
                                                                    d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                                            </svg>
                                                        }
                                                    </span>
                                                    <span>{value.recommend} recommends</span>
                                                </div>
                                                <div>
                                                    <span>answered {answerDate}</span>
                                                    <div>{value.user.nickname}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                    <p style={{ fontSize : "20px", margin : "20px 0px 20px 0px" }}>Your answer</p>
                                    {auth === null ? (
                                        <>
                                            <ReactQuill ref={answerRef} modules={modules} formats={formats} value={content} onChange={handleChange} style={{ height : '300px', filter : "blur(5px)", WebkitFilter : "blur(5px)"}} ></ReactQuill>
                                            <div style={{ position : "relative", top : '-100px', left : '160px', color : 'skyblue', fontSize : '30px', fontWeight : 'bold'}}>You can use it after logging in</div>
                                            <br/><br/>
                                            <_AskBtn>Post Your Answer</_AskBtn>
                                        </>
                                        ) : (
                                            <>
                                                <ReactQuill ref={answerRef} modules={modules} formats={formats} value={content} onChange={handleChange} style={{ height : '300px'}} ></ReactQuill>
                                                <br/><br/>
                                                <_AskBtn onClick={postAnswer}>Post Your Answer</_AskBtn>
                                            </>
                                        )
                                    }

                                </div>
                            </div>
                            {/*<div style={{ backgroundColor : "blue", width : "30%" }}>asd</div>*/}
                        </div>

                    </_MainBar>
                    <_RightSideBar>
                        <div style={{ padding : '10px', border : "1px solid #EFE6C0", backgroundColor : "#FAF3D8", borderRadius : "5px 5px 0px 0px" }}>The Overflow Blog</div>
                        <div style={{ display : "flex", backgroundColor : "#FCF7E4", padding : "10px", border : "1px solid #EFE6C0"  }}>
                            <div style={{ padding : "10px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                            </div>
                            <div style={{ fontSize : '14px' }}>Wondering how sustainable your buildings are? Make your data speak sponsored post</div>
                        </div>
                        <div style={{ padding : '10px', border : "1px solid #EFE6C0", backgroundColor : "#FAF3D8" }}>Featured on Meta</div>
                        <div style={{ border : "1px solid #EFE6C0", borderRadius : "0px 0px 5px 5px" }}>
                            <div style={{ display : "flex", backgroundColor : "#FCF7E4", padding : "10px" }}>
                                <div style={{ padding : "10px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-chat-right" viewBox="0 0 16 16">
                                        <path
                                            d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                                    </svg>
                                </div>
                                <div style={{ fontSize : '14px' }}>Alpha test for short survey in banner ad slots starting on week of September...</div>
                            </div>
                            <div style={{ display : "flex", backgroundColor : "#FCF7E4", padding : "10px" }}>
                                <div style={{ padding : "10px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-chat-right" viewBox="0 0 16 16">
                                        <path
                                            d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                                    </svg>
                                </div>
                                <div style={{ fontSize : '14px' }}>What should be next for community events?</div>
                            </div>
                            <div style={{ display : "flex", backgroundColor : "#FCF7E4", padding : "10px" }}>
                                <div style={{ padding : "10px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-windows" viewBox="0 0 16 16">
                                        <path
                                            d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z"/>
                                    </svg>
                                </div>
                                <div style={{ fontSize : '14px' }}>Temporary policy: Generative AI (e.g., ChatGPT) is banned</div>
                            </div>
                            <div style={{ display : "flex", backgroundColor : "#FCF7E4", padding : "10px" }}>
                                <div style={{ padding : "10px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-database-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M3.904 1.777C4.978 1.289 6.427 1 8 1s3.022.289 4.096.777C13.125 2.245 14 2.993 14 4s-.875 1.755-1.904 2.223C11.022 6.711 9.573 7 8 7s-3.022-.289-4.096-.777C2.875 5.755 2 5.007 2 4s.875-1.755 1.904-2.223Z"/>
                                        <path
                                            d="M2 6.161V7c0 1.007.875 1.755 1.904 2.223C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777C13.125 8.755 14 8.007 14 7v-.839c-.457.432-1.004.751-1.49.972C11.278 7.693 9.682 8 8 8s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972Z"/>
                                        <path
                                            d="M2 9.161V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13s3.022-.289 4.096-.777C13.125 11.755 14 11.007 14 10v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972Z"/>
                                        <path
                                            d="M2 12.161V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972Z"/>
                                    </svg>
                                </div>
                                <div style={{ fontSize : '14px' }}>Expanding Discussions: Let's talk about curation</div>
                            </div>
                            <div style={{ display : "flex", backgroundColor : "#FCF7E4", padding : "10px" }}>
                                <div style={{ padding : "10px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-database-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M3.904 1.777C4.978 1.289 6.427 1 8 1s3.022.289 4.096.777C13.125 2.245 14 2.993 14 4s-.875 1.755-1.904 2.223C11.022 6.711 9.573 7 8 7s-3.022-.289-4.096-.777C2.875 5.755 2 5.007 2 4s.875-1.755 1.904-2.223Z"/>
                                        <path
                                            d="M2 6.161V7c0 1.007.875 1.755 1.904 2.223C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777C13.125 8.755 14 8.007 14 7v-.839c-.457.432-1.004.751-1.49.972C11.278 7.693 9.682 8 8 8s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972Z"/>
                                        <path
                                            d="M2 9.161V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13s3.022-.289 4.096-.777C13.125 11.755 14 11.007 14 10v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972Z"/>
                                        <path
                                            d="M2 12.161V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972Z"/>
                                    </svg>
                                </div>
                                <div style={{ fontSize : '14px' }}>Update on Collectives and Discussions</div>
                            </div>
                        </div>
                        <br/><br/>
                        <div style={{ backgroundColor : "#F8F9F9", padding : "10px", borderRadius : "5px 5px 0px 0px", border : "1px solid lightgray" }}>Custom Filters</div>
                        <div style={{ padding : "10px", borderRadius : "0px 0px 5px 5px", border : "1px solid lightgray", color : "blue" }}>Create a Custom Filter</div>
                    </_RightSideBar>
                </_Contents>
            </_Container>
        </>
    )
}