import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from 'axios';
import {
    _AskBtn,
    _Container,
    _Contents,
    _Home,
    _LeftSideBar,
    _MainBar,
    _SideLi,
    _SideUl
} from "../styledComponents/QusetionsComponents";
import './pre.css'
import {modules, formats} from "../utils/toolBarOption";
import ReactQuill from "react-quill";
import {indexStore} from "../zustand/store";

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
    // console.log(userIndex);
    const unsubscribe = indexStore.subscribe(userIndex => console.log('setUserIndex : ', userIndex), state => state.userIndex);

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
           console.log('답변 작성 성공');
           setContent('');
           getQuestionInfo(0);
        }
    }

    const handleRecommend1 = async (answerId, count) => {
        console.log('answerId: ', answerId);
        console.log('count: ', count);
        const result = await axios({
            method : 'POST',
            url : `${apiUrl}/question/recommend`,
            headers : { auth : auth },
            data : { answerId : Number(answerId), count : Number(count) },
        });
        //
        console.log(result);
        if(result.data.result) {
            console.log('추천 handle 성공');
            getQuestionInfo(0);
        }
    }
    const handleRecommend2 = async (answerId, count) => {
        console.log('answerId: ', answerId);
        console.log('count: ', count);
        const result = await axios({
            method : 'POST',
            url : `${apiUrl}/question/recommend`,
            headers : { auth : auth },
            data : { answerId : Number(answerId), count : Number(count) },
        });
        //
        console.log(result);
        if(result.data.result) {
            console.log('추천 handle 성공');
            getQuestionInfo(0);
        }
    }
    return (
        <>
            <_Container>
                <_LeftSideBar>
                    <_Home>Home</_Home>
                    <_SideUl>
                        PUBLIC
                        <_SideLi>Questions</_SideLi>
                        <_SideLi>Tags</_SideLi>
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
                        <div style={{ display : "flex" }}>
                            <div style={{ width : "70%", margin : "3px" }}>
                                <div style={{ borderBottom : "1px solid lightgray" }} dangerouslySetInnerHTML={{ __html : question.content }}></div>
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
                                            <div dangerouslySetInnerHTML={{ __html : value.content }}></div>
                                            <div style={{ display : "flex"}}>
                                                <div style={{  width : "70%"}}>

                                                    <span>
                                                        {check &&
                                                            <svg style={{ backgroundColor : "skyblue", border : "1px solid skyblue", padding : "3px", borderRadius : "4px", marginBottom : "-5px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                 fill="currentColor" className="bi bi-hand-thumbs-up"
                                                                 viewBox="0 0 16 16" onClick={()=> handleRecommend1(value.id, value.recommend)}>
                                                                <path
                                                                      d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                                                </svg>
                                                        }
                                                        {!check &&
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
                                    <ReactQuill ref={answerRef} modules={modules} formats={formats} value={content} onChange={handleChange} style={{ height : '300px'}} ></ReactQuill><br/><br/>
                                    <_AskBtn onClick={postAnswer}>Post Your Answer</_AskBtn>
                                </div>
                            </div>
                            <div style={{ backgroundColor : "blue", width : "30%" }}>asd</div>
                        </div>

                    </_MainBar>
                </_Contents>
            </_Container>
        </>
    )
}