import styled from "styled-components";


const LayoutGrid= styled.div`
  height:100%;
  display: grid;
  overflow-y: hidden;
  grid-template-columns: ${props=>props.showSidebar?"20% 80%":"5%  95%"};
`

const CenterGrid=styled.div`
  height:100%;
  width: 100%;
  overflow-y: scroll;
  display: grid;
  padding-bottom: 1rem;
  row-gap: 1rem;
  //grid-template-rows:  90% 10%;
  
`;

export {
    CenterGrid,
    LayoutGrid,
}
