import styled from "styled-components";

const Circle=styled.div`
    width:2rem;
    height:2rem;
    border-radius: 50%;
    display: grid;
    color:white;
    place-items: center;
    background-color: dodgerblue;
`

const HeaderLayout=styled.div`
  //z-index: 2;
  height: 3.2rem;
  //margin-right: 1rem;
  //margin-top: 0.5rem;
  //padding: 1rem;
  border-bottom: 1px solid lightgrey;
  //border-top: 1px solid lightgrey;
  //border-right: 1px solid lightgrey;
  box-shadow: 1px 3px 4px 0 rgba(34,41,47,.1);
  //border-top-right-radius: 32px;
  //border-bottom-right-radius: 32px;
  display: grid;
  grid-template-columns: 2fr 0.4fr 0.1fr;
  place-items: center;
  
`

export {
    Circle,
    HeaderLayout
}
