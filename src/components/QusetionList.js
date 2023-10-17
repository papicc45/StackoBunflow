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
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import axios from 'axios';
import {useEffect, useState} from "react";
import './pre.css'
import Pagination from "react-js-pagination";
import './pagination.css';

export default function Questions() {
    const [questionList, setQuestionList] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const localUrl = process.env.REACT_APP_LOCAL_URL;
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('search');
    const [page, setPage] = useState(1);
    const [questionCount, setQuestionCount] = useState(0);

    const getQuestions = async () => {

        const result = await axios({
            method : 'GET',
            url : `${apiUrl}/question/all?page=${page}`
        })
        if(!result.data.result) return;

        setQuestionList(result.data.questionList);
    }
    const searchQuestions = async () => {
        const result = await axios({
            method : 'GET',
            url : `${apiUrl}/question/search?keyword=${keyword}&page=${page}`,
        });

        if(!result.data.result) return;

        setQuestionList(result.data.questionList);
    }
    const getQuestionCount = async () => {
        if(keyword === null) {
            const result = await axios({
                method : "GET",
                url : `${localUrl}/question/count?keyword=${keyword}`,
            });

            setQuestionCount(result.data.result._count.id);
        }else {
            console.log('questioncountfunction : ', keyword);
            const result = await axios({
                method : "GET",
                url : `${localUrl}/question/count?keyword=${keyword}`,
            });

            setQuestionCount(result.data.result._count.id);
            console.log('setquesc :', questionCount);
        }

    }
    // useEffect(()=> {
    //     getQuestionCount();
    //     console.log('after useeffect count : ', questionCount);
    //     console.log('page' , page);
    // }, []);

    useEffect(()=> {
        getQuestionCount();
        if(keyword === null) {
            getQuestions();
        } else {
            searchQuestions();
        }
    }, [questionList]);

    // useEffect(()=> {
    //     console.log('서치퀘스천 전용 effect');
    //     getQuestionCount();
    //     searchQuestions();
    // }, [questionCount]);
    const questionDetail = (id) => {
        navigate(`question/detail/${id}`);
    }

    const handlePageChange = (page) => {
        setPage(page);
    }

    return (
        <>
            <_Container>
                <_LeftSideBar>
                    <_Home>Home</_Home>
                    <_SideUl>
                        PUBLIC
                        <_SideLi  style={{ backgroundColor : "#F1F2F3", borderRight : "3px solid #E5883E", cursor : 'pointer' }}>Questions</_SideLi>
                        <Link to="/taglist"><_SideLi>Tags</_SideLi></Link>
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
                            const givenDate = new Date(value.createdAt);
                            const date = `${givenDate.getFullYear()}-${String(givenDate.getMonth() + 1).padStart(2, '0')}-${String(givenDate.getDate()).padStart(2, '0')}`;
                            const tagsArr = value.tag.substr(1, value.tag.length).split(" ");
                            const sanitizedText = new DOMParser().parseFromString(value.content, 'text/html').body.textContent || "";
                            return (
                                <_Question onClick={()=> questionDetail(value.id)}>
                                    <div style={{ margin : "5px", width : "65px"}}>
                                        <br/><br/>
                                        <p style={{ fontSize : '12px' }}>answers</p>
                                        <p style={{ fontSize : '12px' }}>{value.count} views</p>
                                    </div>
                                    <div style={{ width : "100%", margin : "5px", maxWidth : '500px'}}>
                                        <p style={{ fontWeight : "bold", fontSize : "20px", textOverflow : 'ellipsis', overflow : 'hidden' }}>{value.title}</p>
                                        <div style={{ textOverflow : 'ellipsis', overflow : 'hidden' }}>{sanitizedText}</div>
                                        <br/>
                                        <div style={{ display : "flex", justifyContent : "space-between"}}>
                                            <div>
                                                {tagsArr.map((value, idx)=> {
                                                    return <_Tag style={{ fontfamily : 'intelone-mono-font-family-regular' }}>{value}</_Tag>
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
                        {/*<div style={{ display :"flex", justifyContent : "center", paddingTop : "20px" }}>*/}
                        {/*    {pageRendering()}*/}
                        {/*</div>*/}
                        <div>
                            <Pagination activePage={page} itemsCountPerPage={5} totalItemsCount={questionCount} pageRangeDisplayed={5} prevPageText={"<"} nextPageText={">"} onChange={handlePageChange}></Pagination>
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