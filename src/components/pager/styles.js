import styled from "styled-components";


const PagerLayout = styled.div`
    display:block;
    width:100%;
    `;

const PagerControl = styled.div`
  display: grid;
  place-items: center start;
  grid-template-columns: 20% 80%;
`

const PagerInput = styled.input`
  transition: all ease-in-out 0.2s;
  padding-left: 15px;
  border-radius:23px;
  border:1px solid lightgrey;
  width:100%;
  height: 2.3rem;
  caret-color: lightgrey;
  font-size: medium;
  font-weight: lighter;
  &:focus{
    box-shadow: 0px 0px 8px lightgrey;
    border:2px solid lightgrey;
  }
`;

export {
    PagerControl,
    PagerLayout,
    PagerInput
}
