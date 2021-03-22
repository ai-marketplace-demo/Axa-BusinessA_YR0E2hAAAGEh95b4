import styled from "styled-components";

const TableStyle=styled.div`
    z-index: 2;
    border-radius: 12px;
    //background-color: lightgrey;
    border: 1px solid lightgrey;
    display : block;
  padding-bottom: 1rem;
   background-color:white;
    text-align: left;
    &:hover{
      box-shadow: 0 0 2px 3px lightgrey;
    }
`

const TableColumnStyled=styled.div`
    display: grid;
    place-items: start start;
    font-size: x-small;
    padding-left:12px;
    padding-right:12px;
    grid-template-columns: 1.3fr 1fr;
`
const TableHeaderStyle=styled.div`
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    height:2.2rem;
    background-color: dodgerblue;
    color: white;
    font-size: smaller;
    font-weight: bolder;
    padding:7px;
    width:100%;
`


const SchemaLayout = styled.div`
  width:95%;
  display: grid;
  row-gap: 1rem;
  column-gap: 5%;
  grid-template-columns: 1fr 1fr 1fr 1fr ;
  //grid-template-rows: 1fr;
  margin-bottom: 5rem;
`
export {SchemaLayout,TableHeaderStyle,TableStyle,TableColumnStyled};
