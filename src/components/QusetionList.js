import {
    _AllQuestions,
    _AskBtn,
    _AskDiv,
    _Container,
    _Contents,
    _Home,
    _LeftSideBar, _MainBar, _Question, _RightSideBar,
    _SideLi,
    _SideUl, _Tag
} from "../styledComponents/QusetionsComponents";
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import {useEffect, useState} from "react";

export default function Questions() {
    const [questionList, setQuestionList] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(()=> {

        const getQuestions = async () => {
            const result = await axios({
                method : 'GET',
                url : `${apiUrl}/question/all`
            })

            if(!result.data.result) return;

            setQuestionList(result.data.questionList);
        }

        getQuestions();
    }, []);

    const questionDetail = (id) => {
        navigate(`question/detail/${id}`);
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
                    <_MainBar>
                        <_AskDiv>
                            <h2>All Questions</h2>
                            <div>
                                <_AskBtn><Link to="/questions/ask">Ask Question</Link></_AskBtn>
                            </div>
                        </_AskDiv>
                        {questionList && questionList.map((value, idx)=> {
                            console.log(value.tag);
                            const givenDate = new Date(value.createdAt);
                            const date = `${givenDate.getFullYear()}-${String(givenDate.getMonth() + 1).padStart(2, '0')}-${String(givenDate.getDate()).padStart(2, '0')}`;
                            const tagsArr = value.tag.substr(1, value.tag.length).split(" ");
                            const sanitizedText = new DOMParser().parseFromString(value.content, 'text/html').body.textContent || "";
                            return (
                                <_Question onClick={()=> questionDetail(value.id)}>
                                    <div style={{ margin : "10px" }}>
                                        <p>votes</p>
                                        <p>answers</p>
                                        <p>{value.count} views</p>
                                    </div>
                                    <div style={{ width : "100%", margin : "5px", maxWidth : '500px'}}>
                                        <p style={{ fontWeight : "bold", fontSize : "20px", textOverflow : 'ellipsis', overflow : 'hidden' }}>{value.title}</p>
                                        <div style={{ textOverflow : 'ellipsis', overflow : 'hidden' }}>{sanitizedText}</div>
                                        <br/>
                                        <div style={{ display : "flex", justifyContent : "space-between"}}>
                                            <div>
                                                {tagsArr.map((value, idx)=> {
                                                    return <_Tag>{value}</_Tag>
                                                })}
                                            </div>
                                            <div>
                                                <span>{value.user.nickname}</span>
                                                &nbsp;&nbsp;<span>{date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </_Question>
                            )
                        })}
                    </_MainBar>
                    <_RightSideBar>asd</_RightSideBar>
                </_Contents>
            </_Container>
        </>
    )
}