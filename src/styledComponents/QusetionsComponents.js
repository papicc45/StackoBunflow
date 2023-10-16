import { styled } from "styled-components";
import '../components/pre.css'
export const _Container = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
`

export const _LeftSideBar = styled.div`
`

export const _Home = styled.div`
  margin: 20px;
`

export const _SideUl = styled.ul`
  list-style: none;
`

export const _SideLi = styled.li`
  margin: 10px;
  margin-left: 20px;
`

export const _Contents = styled.div`
  display: flex;
`

export const _MainBar = styled.div`
  width: 600px;
  padding: 20px;
`

export const _RightSideBar = styled.div`
    width: 300px;
  padding: 20px;
`

export const _AskDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
`

export const _AskBtn = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: dodgerblue;
  margin-top: 15px;
  cursor: pointer;
`
export const _AllQuestions = styled(_AskDiv)``

export const _Question = styled.div`
  display: flex;
  padding: 15px;
  border-bottom: 1px solid lightgray;
`

export const _Tag = styled.span`
  padding: 3px;
  border-radius: 5px;
  background-color: skyblue;
  font-size: 8px;
  margin-left: 2px;
  font-family: 'intelone-mono-font-family-regular';
`