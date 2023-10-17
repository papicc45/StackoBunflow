import styled from 'styled-components';

export const _HeaderBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid lightgray;
  position: relative;
  
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
  padding-left: 27px;
  width: 450px;
  @media screen and (max-width: 1024px) {
    width: 200px;
  }
  &:focus {
    outline: none;
  }
`

export const _LoginBtn = styled.button`
  width: 100px;
  margin : 10px;
  padding : 10px;
  padding : 10px;
  border: none;
  border-radius: 4px;
  
`

export const _SignupBtn = styled(_LoginBtn)`

`

export const _AlarmBalloon = styled.div`
  position: absolute;
  border : 1px solid skyblue;
  padding: 10px;
  border-radius: 7px;
  margin : 5px 5px 5px 0px;
  background-color: skyblue;
`

export const _AlarmBalloonEdge = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 5px solid skyblue;
  border-right: 5px solid transparent;
  border-bottom: 5px solid skyblue;
  border-top: 5px solid transparent;
`

export const _Alarm = styled.div`
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity ${props => props.visible ? '0s' : '3s'};
  position: relative;
  z-index: 9999;
`
