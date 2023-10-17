import {
    _Container,
    _Contents,
    _Home,
    _LeftSideBar,
    _MainBar,
    _SideLi,
    _SideUl, _Tag
} from "../styledComponents/QusetionsComponents";
import axios  from "axios";
import {useEffect, useState} from "react";
import './pre.css';
import {useNavigate} from "react-router-dom";
export default function TagList() {
    const [tagList, setTagList] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const localUrl = process.env.REACT_APP_LOCAL_URL;
    const navigate = useNavigate();
    const getTagList = async () => {
        const result = await axios({
            method : "GET",
            url : `${apiUrl}/question/tags`,
        });

        setTagList(result.data.tagList);
    }

    const allQuestions = () => {
        navigate('/questions');
    }
    const searchQuestions = (tagName) => {
        navigate(`/questions/?search=${tagName}`);
    }
    useEffect(()=> {
        getTagList();
    }, [])
    return (
        <>
            <_Container>
                <_LeftSideBar>
                    <_Home>Home</_Home>
                    <_SideUl>
                        PUBLIC
                        <_SideLi onClick={allQuestions} style={{ cursor : 'pointer' }}>Questions</_SideLi>
                        <_SideLi style={{ backgroundColor : "#F1F2F3", borderRight : "3px solid #E5883E" }}>Tags</_SideLi>
                        <_SideLi>Users</_SideLi>
                    </_SideUl>
                </_LeftSideBar>
                <_Contents>
                    <_MainBar style={{ width : "900px" }}>
                        <div style={{ display : "flex", flexWrap : "wrap" }}>
                            {tagList.map((value, key)=> {
                                return (
                                        <div style={{ width : "150px", height : "50px", padding : "10px", border : '1px solid lightgray', margin : "10px", borderRadius : "5px", lineHeight : "50px" }} onClick={()=> searchQuestions(value.tagName)}>
                                            <_Tag>{value.tagName}</_Tag>
                                            <span> - {value.count} questions</span>
                                        </div>
                                    )
                            })}
                        </div>
                    </_MainBar>
                </_Contents>
            </_Container>
        </>
    )
}