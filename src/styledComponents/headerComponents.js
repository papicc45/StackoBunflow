import styled from 'styled-components';

export const _HeaderBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid lightgray;
  
`

export const _Logo = styled.div`

`

export const _Ul = styled.ul`
  display: flex;
  list-style: none;
  @media screen and (max-width: 925px) {
    display: none;
  }`;

export const _Li = styled.li`
  margin-left: 10px;
  margin-right: 10px;

  &:hover{
    background-color:lightgray;
    border-radius: 4px;
  }
`

export const _SearchDiv = styled.div`
  padding: 10px;
  position: relative;
`

export const _SearchInput = styled.input`
  height: 25px;
  padding-left: 20px;
  width: 300px;
  @media screen and (max-width: 1024px) {
    width: 200px;
  }
  &:focus {
    outline: none;
  }
`

export const _LoginBtn = styled.button`
  margin : 10px;
  padding : 10px;
  padding : 10px;
  border: none;
  border-radius: 4px;
  
`

export const _SignupBtn = styled(_LoginBtn)`

`
