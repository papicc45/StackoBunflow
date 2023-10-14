import styled from 'styled-components';

export const _SignUpDiv = styled.div`
  width: 400px;
  height: 500px;
  padding : 30px;
  background-color: deepskyblue;
  margin: auto;
  margin-top: 300px;
  border-radius: 20px;
`

export const _SignInDiv = styled(_SignUpDiv)`
  width: 400px;
  height: 400px;
`
export const _IdInput = styled.input`
  height: 30px;
  width: 90%;
  border: none;
  outline: none;
  transition: all 0.3s ease;
  margin-right: auto;
  margin-left: auto;
  display: block;
  &:focus {
    border: none;
    outline: none;
    transform: scale(1.1);
  }
  
`
export const _PasswordInput = styled(_IdInput)`
  
`

export const _NickNameInput = styled(_IdInput)`
`

export const _SignUpBtn = styled.button`
  width: 90%;
  height: 40px;
  border-radius: 10px;
  margin-top: 80px;
  border: none;
  background-color: dodgerblue;
  transition: all 0.3s ease;
  margin-right: auto;
  margin-left: auto;
  display: block;
  &:hover{
    cursor : pointer;
    transform: scale(1.1);
  }
`
export const _SignInBtn = styled(_SignUpBtn)`
`
export const _TestDiv = styled.div`
  width: 100%;
  height: 200px;
  background-color: blue;
`