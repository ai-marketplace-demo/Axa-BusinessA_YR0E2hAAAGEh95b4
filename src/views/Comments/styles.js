import styled from "styled-components";


const FeedLayout = styled.div`
  display: grid;
  width: 90%;
  grid-template-rows: auto auto 1fr ;
  grid-row-gap: 0.2rem;
  padding: 3rem;
  margin-left: 1rem;
  border-left: 1px lightgrey solid;
  box-shadow: 7px 0 3px 1px rgba(0, 0, 0, 0.03);
`


const FeedTitleLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto auto  1fr auto ;
  grid-column-gap: 3px;
  place-items: center start ;
`


export {FeedLayout, FeedTitleLayout};
