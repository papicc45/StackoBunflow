import {
    _AddingTags,
    _Empty,
    _Guide, _IntroduceTheProblem,
    _NextBtn, _QuestionProblemDiv,
    _QuestionTitleDiv, _TagDiv, _TagInput,
    _TitleInput,
    _WritingAGoodTitle
} from "../styledComponents/AskQuestionComponents";
import {useEffect, useRef, useState} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill의 스타일시트
import axios from 'axios';
import {modules, formats} from "../utils/toolBarOption";
import {indexStore} from "../zustand/store";
import Swal from 'sweetalert2';
import {useNavigate} from "react-router-dom";
import './inlineCode.css'

export default function AskQuestion() {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const titleRef = useRef();
    const problemRef = useRef();
    const tagRef = useRef();
    const [checkAlreadyTag, setCheckAlreadyTag] = useState(false);
    const [tagList, setTagList] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const {userIndex} = indexStore();
    const navigate = useNavigate();


    const handleChange = (value) => {
        setContent(value);
    };

    const handleTitleFocus = () => {
        titleRef.current.style.visibility = 'visible';
        problemRef.current.style.visibility = 'hidden';
        tagRef.current.style.visibility = 'hidden';
    }

    const handleProblemFocus = () => {
        titleRef.current.style.visibility = 'hidden';
        problemRef.current.style.visibility = 'visible';
        tagRef.current.style.visibility = 'hidden';
    }
    const handleTagFocus = () => {
        titleRef.current.style.visibility = 'hidden';
        problemRef.current.style.visibility = 'hidden';
        tagRef.current.style.visibility = 'visible';
    }

    const handleKeyDown = (e) => {
        if(e.keyCode === 13) {
            let check = true;
            for(let val of tagList) {
                if(val === e.target.value) {
                    check = false;
                }
            }
            if(check) {
                setTagList([...tagList, e.target.value]);
            } else {
                setCheckAlreadyTag(true);
                console.log(checkAlreadyTag)
            }
            e.target.value = '';
        }
    }
    const deleteTag = (value) => {
        setTagList(tagList.filter((val)=>  val !== value));
    }

    const writeQuestion = async () => {
        if(title === '') {
            titleRef.current.focus();
            return;
        }

        if(content === '') {
            problemRef.current.focus();
            return;
        }

        if(tagList.length === 0) {
            tagRef.current.focus();
            return;
        }
        let tags = '';
        for(let tag of tagList) {
            tags += ` ${tag}`;
        }
        const auth = window.localStorage.getItem('auth');
        const result = await axios({
            method : 'POST',
            url : `${apiUrl}/question`,
            headers : { auth : auth },
            data : { title, content, tag : tags },
        })
        console.log(result.data.result);
        if(result.data.result) {
            Swal.fire({
                title : 'Your question has been successfully registered ',
                confirmButtonText : 'Comfirm',
            }).then((result)=> {
                if(result.isConfirmed) {
                    navigate('/questions');
                }
            })
        }

    }
    return (
        <>
            <div style={{ display : "flex", justifyContent : 'center', margin : "0"}}>
                <div style={{ width : "1035px" }}>

                    <h1 style={{ marginTop : "20px", marginBottom : "20px" }}>Ask a public question</h1>
                    <div>
                        <div style={{ display : "flex" }}>

                            <_Guide>
                                <h3>Writing a good question</h3>
                                <span>You’re ready to ask a programming-related question and this form will help guide you through the process.<br/>
                                            Looking to ask a non-programming question? See the topics here to find a relevant site.</span>
                                <h5>Steps</h5>
                                <ul>
                                    <li>Summarize your problem in a one-line title.</li>
                                    <li>Describe your problem in more detail.</li>
                                    <li>Describe what you tried and what you expected to happen..</li>
                                    <li>Add “tags” which help surface your question to members of the community.</li>
                                    <li>Review your question and post it to the site.</li>
                                </ul>
                            </_Guide>
                        </div>
                    </div>
                    <div style={{ display : "flex",  alignItems : "flex-start"}}>
                        <_QuestionTitleDiv>
                            <div>Title</div>
                            <span>Be specific and imagine you’re asking a question to another person.</span><br/> <br/>
                            <_TitleInput onFocus={handleTitleFocus} onChange={(e)=> setTitle(e.target.value)}></_TitleInput><br/>
                        </_QuestionTitleDiv>
                            <div>
                                <_WritingAGoodTitle ref={titleRef}>
                                    <div style={{ borderBottom : "1px solid lightgray", padding : "10px", backgroundColor : "whitesmoke" }}>Writing a good title</div>
                                    <div style={{ display : "flex", padding : "10px", maxWidth : "500px" }}>
                                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                             width="50pt" height="70pt" viewBox="0 0 742.000000 1280.000000"
                                             preserveAspectRatio="xMidYMid meet">
                                            <metadata>
                                                Created by potrace 1.15, written by Peter Selinger 2001-2017
                                            </metadata>
                                            <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                                               fill="#000000" stroke="none">
                                                <path d="M5812 12406 c-84 -216 -177 -454 -206 -529 l-54 -136 234 -152 c129
    -83 234 -153 234 -155 0 -7 -14 2 -255 154 -121 77 -223 137 -226 133 -3 -3
    -545 -1122 -1204 -2486 -659 -1364 -1288 -2666 -1398 -2894 l-201 -415 55
    -708 c46 -611 56 -707 69 -703 8 3 364 144 790 313 l775 308 727 1734 c401
    954 946 2255 1213 2890 l484 1155 286 519 c157 286 284 520 283 521 -8 5
    -1443 840 -1447 842 -3 2 -75 -174 -159 -391z"/>
                                                <path d="M2425 4456 c-362 -92 -623 -179 -798 -267 -84 -42 -441 -253 -585
    -346 -181 -116 -344 -255 -427 -363 -124 -161 -173 -333 -141 -488 20 -98 57
    -163 141 -248 114 -116 257 -200 650 -379 424 -193 584 -305 662 -462 25 -51
    28 -69 28 -153 0 -116 -18 -173 -86 -275 -187 -279 -694 -546 -1401 -739 -196
    -53 -419 -106 -448 -106 -13 0 -20 -5 -18 -14 4 -17 546 -616 558 -616 13 0
    353 123 470 170 380 152 739 336 994 510 373 254 596 554 596 802 0 133 -81
    293 -228 449 -92 98 -446 421 -517 471 -68 49 -181 104 -365 178 -85 34 -180
    75 -210 90 -133 67 -232 168 -259 265 -15 55 -14 179 3 241 44 164 173 336
    450 597 191 180 264 237 421 332 135 81 496 263 668 335 70 30 127 60 127 67
    0 20 -17 17 -285 -51z"/>
                                            </g>
                                        </svg>
                                        <div style={{ padding : "10px", fontSize : "8px" }}>
                                            <span>Your title should summarize the problem.</span><br/><br/>
                                            <span>You might find that you have a better idea of your title after writing out the rest of the question.</span>

                                        </div>
                                    </div>
                                </_WritingAGoodTitle>
                            </div>
                    </div>
                    <div style={{ display : "flex", alignItems : 'flex-start'}}>
                        <_QuestionProblemDiv>
                            <div>What are the details of your problem?</div>
                            <span>Introduce the problem and expand on what you put in the title. Minimum 20 characters.</span><br/><br/>
                            <div style={{height : "400px"  }}>
                                <ReactQuill  modules={modules} formats={formats} value={content} onChange={handleChange} style={{ height : '300px'}} onFocus={handleProblemFocus}></ReactQuill><br/><br/>
                            </div>
                        </_QuestionProblemDiv>
                        <div>
                            <_IntroduceTheProblem ref={problemRef} style={{ visibility : 'hidden' }}>
                                <div style={{ borderBottom : "1px solid lightgray", padding : "10px", backgroundColor : "whitesmoke" }}>Introduce the problem</div>
                                <div style={{ display : "flex", padding : "10px", maxWidth : "500px" }}>
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                         width="50pt" height="70pt" viewBox="0 0 742.000000 1280.000000"
                                         preserveAspectRatio="xMidYMid meet">
                                        <metadata>
                                            Created by potrace 1.15, written by Peter Selinger 2001-2017
                                        </metadata>
                                        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                                           fill="#000000" stroke="none">
                                            <path d="M5812 12406 c-84 -216 -177 -454 -206 -529 l-54 -136 234 -152 c129
-83 234 -153 234 -155 0 -7 -14 2 -255 154 -121 77 -223 137 -226 133 -3 -3
-545 -1122 -1204 -2486 -659 -1364 -1288 -2666 -1398 -2894 l-201 -415 55
-708 c46 -611 56 -707 69 -703 8 3 364 144 790 313 l775 308 727 1734 c401
954 946 2255 1213 2890 l484 1155 286 519 c157 286 284 520 283 521 -8 5
-1443 840 -1447 842 -3 2 -75 -174 -159 -391z"/>
                                            <path d="M2425 4456 c-362 -92 -623 -179 -798 -267 -84 -42 -441 -253 -585
-346 -181 -116 -344 -255 -427 -363 -124 -161 -173 -333 -141 -488 20 -98 57
-163 141 -248 114 -116 257 -200 650 -379 424 -193 584 -305 662 -462 25 -51
28 -69 28 -153 0 -116 -18 -173 -86 -275 -187 -279 -694 -546 -1401 -739 -196
-53 -419 -106 -448 -106 -13 0 -20 -5 -18 -14 4 -17 546 -616 558 -616 13 0
353 123 470 170 380 152 739 336 994 510 373 254 596 554 596 802 0 133 -81
293 -228 449 -92 98 -446 421 -517 471 -68 49 -181 104 -365 178 -85 34 -180
75 -210 90 -133 67 -232 168 -259 265 -15 55 -14 179 3 241 44 164 173 336
450 597 191 180 264 237 421 332 135 81 496 263 668 335 70 30 127 60 127 67
0 20 -17 17 -285 -51z"/>
                                        </g>
                                    </svg>
                                    <div style={{ padding : "10px", fontSize : "8px" }}>
                                        <span>Explain how you encountered the problem you’re trying to solve, and any difficulties that have prevented you from solving it yourself.</span>
                                    </div>
                                </div>
                            </_IntroduceTheProblem>
                        </div>
                    </div>
                    <div style={{ display : "flex",  alignItems : "flex-start"}}>
                        <_TagDiv>
                            <div>Tag</div>
                            <span>Add up to 5 tags to describe what your question is about. Start typing to see suggestions.</span><br/> <br/>
                            {checkAlreadyTag && <p style={{ color : 'red', fontSize : '12px' }}>You have already entered that tag. Please enter a different tag</p>}
                            <_TagInput onFocus={handleTagFocus} onKeyDown={(e)=> handleKeyDown(e)}></_TagInput><br/>
                            {tagList.map((value, idx)=> {
                                return (
                                    <span style={{ backgroundColor : "skyblue", padding : "3px", borderRadius : "2px", marginRight : "2px"  }} key={idx}>
                                            {value}&nbsp;
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                             fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16" onClick={()=> setTagList(tagList.filter((val)=> val !== value))}>
                                                <path
                                                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                            </svg>
                                        </span>
                                )
                            })}
                            <br/>
                            <_NextBtn onClick={writeQuestion}>Write Question</_NextBtn>
                        </_TagDiv>
                        <div>
                            <_AddingTags ref={tagRef}>
                                <div style={{ borderBottom : "1px solid lightgray", padding : "10px", backgroundColor : "whitesmoke" }}>Adding tags</div>
                                <div style={{ display : "flex", padding : "10px", maxWidth : "500px" }}>
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                         width="50pt" height="70pt" viewBox="0 0 742.000000 1280.000000"
                                         preserveAspectRatio="xMidYMid meet">
                                        <metadata>
                                            Created by potrace 1.15, written by Peter Selinger 2001-2017
                                        </metadata>
                                        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                                           fill="#000000" stroke="none">
                                            <path d="M5812 12406 c-84 -216 -177 -454 -206 -529 l-54 -136 234 -152 c129
    -83 234 -153 234 -155 0 -7 -14 2 -255 154 -121 77 -223 137 -226 133 -3 -3
    -545 -1122 -1204 -2486 -659 -1364 -1288 -2666 -1398 -2894 l-201 -415 55
    -708 c46 -611 56 -707 69 -703 8 3 364 144 790 313 l775 308 727 1734 c401
    954 946 2255 1213 2890 l484 1155 286 519 c157 286 284 520 283 521 -8 5
    -1443 840 -1447 842 -3 2 -75 -174 -159 -391z"/>
                                            <path d="M2425 4456 c-362 -92 -623 -179 -798 -267 -84 -42 -441 -253 -585
    -346 -181 -116 -344 -255 -427 -363 -124 -161 -173 -333 -141 -488 20 -98 57
    -163 141 -248 114 -116 257 -200 650 -379 424 -193 584 -305 662 -462 25 -51
    28 -69 28 -153 0 -116 -18 -173 -86 -275 -187 -279 -694 -546 -1401 -739 -196
    -53 -419 -106 -448 -106 -13 0 -20 -5 -18 -14 4 -17 546 -616 558 -616 13 0
    353 123 470 170 380 152 739 336 994 510 373 254 596 554 596 802 0 133 -81
    293 -228 449 -92 98 -446 421 -517 471 -68 49 -181 104 -365 178 -85 34 -180
    75 -210 90 -133 67 -232 168 -259 265 -15 55 -14 179 3 241 44 164 173 336
    450 597 191 180 264 237 421 332 135 81 496 263 668 335 70 30 127 60 127 67
    0 20 -17 17 -285 -51z"/>
                                        </g>
                                    </svg>
                                    <div style={{ padding : "10px", fontSize : "8px" }}>
                                        <span>Tags help ensure that your question will get attention from the right people.</span><br/><br/>
                                        <span>Tag things in more than one way so people can find them more easily. Add tags for product lines, projects, teams, and the specific technologies or languages used.</span>

                                    </div>
                                </div>
                            </_AddingTags>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}