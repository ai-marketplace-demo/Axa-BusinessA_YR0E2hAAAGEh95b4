import styled from "styled-components";


const CatalogLayout = styled.div`
  // title (auto)
  // searchbar  (auto)
  // facets  results] (1fr)
  overflow-y: scroll;
  //scrollbar-width:none;
  height: 100%;
  margin: 0.5rem;
  display: grid;
  grid-template-rows: auto auto 100%;
  & .mini {
    height: 2.1rem;
    border-radius: 6px;
  }
  .mainsearch {
    margin-bottom: 1rem;
    border-radius: 19px;
    height:2.1rem;
    background-color: white;
  }
  .mainsearch:focus {
    box-shadow: 0 0 3px 4px rgba(0, 0, 0, 0.04);
  }

  .multilistresult::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */

  .multilistresult {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

`

const CatalogSearchLayout=styled.div`
  width:1fr;
  height:1fr;
`

const CatalogHeader = styled.div`
  display: grid;
  //background: linear-gradient(to bottom,rgba(0,0,0,0.01),white);
  padding: 1rem;
  grid-template-columns: auto auto auto  1fr auto 0.1fr;
  grid-column-gap: 3px;
  place-items: center start;

`
const MiniSearch = styled.div`
  input {
    height: 1rem;
    border: 1px solid red;
  }
`;


const HitCard=styled.div`
    width:1fr;
    border-radius: 13px;
    padding: 1rem;
    margin-top: 13px;
    border : 1px lightgrey solid;
`;
export {
    HitCard,
    MiniSearch,
    CatalogHeader,
    CatalogLayout,
    CatalogSearchLayout
}
