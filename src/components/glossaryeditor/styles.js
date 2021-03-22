import styled from "styled-components";


const TermStyle=styled.div`
    padding:7px;
    text-align: center;
    border:1px solid lightgrey;
   font-size: smaller;
    border-radius: 13px;
  display:grid;
  place-items: start center;
  grid-template-columns: 1fr 0.2fr;
   background-color: rgba(0,0,0,0.03);
`

const GlossarySelect = styled.div`
  z-index: 2;
  position:absolute;
  left: 50%;
  top:50%;
  width:500px;
  height:500px;
  overflow-y: scroll;
  padding-bottom: 2rem;
  box-shadow: 2px 0 4px 3px lightgrey;
  display : block;
  background-color: white;
  //grid-template-rows: 1fr 10fr ;
`


const GlossarySelectLayoutHeader = styled.div`
  padding:1rem;
  display:grid;
  grid-template-columns:1fr 0.2fr ;
`

const GlossarySelectBodyLayout = styled.div`
  padding:1rem;
  display:grid;
  grid-template-columns:1fr;  
  grid-template-rows:0.1fr 1fr;  
`

export {
    GlossarySelectLayoutHeader,
    GlossarySelectBodyLayout,
    TermStyle,
    GlossarySelect
}
