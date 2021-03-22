import styled from "styled-components";

const Zoomable=styled.div`
  padding-left: 1ch;
    transition: width ease-in-out 0.2s;
    &:hover{
      transform: scale(1.3);
    }
`

export {Zoomable};
