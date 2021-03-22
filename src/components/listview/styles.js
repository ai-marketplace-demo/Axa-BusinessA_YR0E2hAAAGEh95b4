import styled from "styled-components";

const DataViewHeader= styled.div`
  display: grid;
  //background: linear-gradient(to bottom,rgba(0,0,0,0.01),white);
  padding: 1rem;
  grid-template-columns: auto auto auto  1fr auto 0.1fr;
  grid-column-gap: 3px;
  place-items: center start ;
`
const DataViewLayout = styled.div`
  margin-left:0.5rem;
  margin-right:0.5rem;
  margin-bottom: 8rem;
  height: 100%;
  width: 1fr;
  display: grid;
  grid-template-rows: auto auto 1fr 12rem ;
  & .title {
    display: grid;
    padding: 0.3rem;
    grid-template-columns: 0.1fr 3fr  1fr 1fr 0.01fr;
    place-items: flex-start;
  }

  & .items {
    //margin-top: 1rem;
  }
`

export {
    DataViewHeader,
    DataViewLayout

}
