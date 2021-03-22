import styled from "styled-components";


const DropdownBtn=styled.div`
  padding: 8px;
  //border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr 0.2fr;
  cursor: pointer;
  column-gap: 12px;
  opacity: 91%;
  place-items: center start;
  &:hover,&:focus{
    opacity: 100%;
  }
`;

const DropdownContainer= styled.div`
    font-size: xx-small  ;
    position: relative;
    display: inline-block;
    width: ${props=>props.width?props.width:'12rem'};
`


const DropdownContent = styled.div`
  display: block;
  position: absolute;
  background-color: white;
  min-width: 13rem;
  //margin-left: 2rem;
  width:${props=>props.width?props.width:'13rem'};
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 22;
`;

const DropdownItem = styled.div`
  z-index: 33;
  color: black;
  padding: 8px 16px;
  text-decoration: none;
  display: block;
  &:hover{
    background-color: rgba(0,0,0,0.03);
  }
`
export {
    DropdownBtn,
    DropdownContent,
    DropdownItem,
    DropdownContainer
}
