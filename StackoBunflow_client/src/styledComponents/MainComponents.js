import styled from 'styled-components';

export const _MainDiv = styled.div`
  width: 90%;
  height: 2000px;
  background-color: darkcyan;
  padding: 30px;
  margin : 30px;
  border-radius: 30px;
`

export const _TypingDiv = styled.div`
  width: 200px;
  height: 200px;
  padding: 30px;
`;

export const _TextSpan = styled.span`
  font-weight: bold;
`
export const _Blink = styled.span`
    animation: blink 0.5s infinite;
  
  @keyframes blink {
    to {
      opacity: 0;
    }
  }
`

