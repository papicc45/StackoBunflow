import { _HeaderBox, _Logo, _Ul, _Li, _SearchDiv, _SearchInput, _LoginBtn, _SignupBtn } from '../styledComponents/headerComponents'
import {Link} from "react-router-dom";
import  './linkStyle.css';
import {useEffect} from "react";
import {indexStore} from "../zustand/store";
export default function Header() {
    const {removeUserIndex} = indexStore();

    const auth = window.localStorage.getItem('auth');
    // useEffect(()=> {
    //
    // }, [auth]);
    const logout = () => {
        removeUserIndex();
        window.localStorage.removeItem('auth');

    }
    return (
        <>
            <_HeaderBox>
                <_Logo>
                    <Link to='/'>
                        <img src={process.env.PUBLIC_URL + '/logo.png'} style={{width : '180px', height : '46px'}}></img>
                    </Link>
                </_Logo>
                <_Ul>
                    <_Li>About</_Li>
                    <_Li>Products</_Li>
                    <_Li><Link to="/questions">All Questions</Link></_Li>
                </_Ul>
                <_SearchDiv>
                    <_SearchInput placeholder="Search..."></_SearchInput>
                    <svg style={{position : "absolute", left : "15px", bottom : "20px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-search" viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </_SearchDiv>
                <div>
                    {console.log(auth)}
                    {auth === null ? (
                            <>
                                <_LoginBtn><Link to="/signin">Log in</Link></_LoginBtn>
                                <_SignupBtn><Link to="/signup">Sign Up</Link></_SignupBtn>
                            </>
                        ) : (
                            <>
                                <_LoginBtn onClick={logout}>Log Out</_LoginBtn>
                                <_SignupBtn><Link to="/signup">My Info</Link></_SignupBtn>
                            </>
                        )

                    }


                </div>
            </_HeaderBox>
        </>
    )
}