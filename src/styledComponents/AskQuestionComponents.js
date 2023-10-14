import styled from 'styled-components';

export const _Guide = styled.div`
  border: 1px solid dodgerblue;
  background-color: powderblue;
  padding: 10px;
  width: 600px;
  border-radius: 5px;
`

export const _QuestionTitleDiv = styled.div`
  padding: 20px;
  border: 1px solid lightgray;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`
export const _QuestionProblemDiv = styled(_QuestionTitleDiv)``
export const _TagDiv = styled(_QuestionTitleDiv)``
export const _TitleInput = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 5px;
  border : 1px solid lightgray;
  &:focus {
   outline: none;
    box-shadow: 0 0 0 1px blue, 0 0 0 4px skyblue;;
  }
`
export const _TagInput = styled(_TitleInput)`
  margin-bottom: 5px;
`

export const _WritingAGoodTitle = styled.div`
  border : 1px solid lightgray;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  margin-left: 20px;
  visibility: visible;
`
export const _Empty = styled(_WritingAGoodTitle)`
  width: 331.547px;
  border: none;
  box-shadow: none;
`;
export const _IntroduceTheProblem = styled(_WritingAGoodTitle)``
export const _AddingTags = styled(_WritingAGoodTitle)``

export const _NextBtn = styled.button`
  padding: 10px;
  margin-top: 5px;
  background-color: deepskyblue;
  border-radius: 5px;
  border : none;
`