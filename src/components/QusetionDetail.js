import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from 'axios';
import {useSelector} from "react-redux";
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

export default function QusetionDetail() {
    const [content, setContent] = useState('');
    const {questionId} = useParams();
    const [question, setQuestion] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL;
    const auth = useSelector(state => state.auth.auth);

    const handleChange = (value) => {
        setContent(value);
    };

    useEffect(()=> {
        const getQuestionInfo = async () => {
            const result = await axios({
                method : 'GET',
                url : `${apiUrl}/question/${questionId}`
            })
            console.log(result);
            if(result.data.result) {
                setQuestion(result.data.question);
            }
        }

        getQuestionInfo();
    }, []);

    const givenDate = new Date(question.createdAt);
    const date = `${givenDate.getFullYear()}-${String(givenDate.getMonth() + 1).padStart(2, '0')}-${String(givenDate.getDate()).padStart(2, '0')}`;


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
                                {/*{question.answer.map((value, idx)=> {*/}
                                {/*    console.log(question.answer.length);*/}
                                {/*})}*/}
                                <div>
                                    <p style={{ fontSize : "20px", margin : "20px 0px 20px 0px" }}>Your answer</p>
                                    <ReactQuill  modules={modules} formats={formats} value={content} onChange={handleChange} style={{ height : '300px'}} ></ReactQuill><br/><br/>
                                    <_AskBtn >Post Your Answer</_AskBtn>
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