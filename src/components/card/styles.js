import styled from "styled-components";


const CardCircle = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  //color: rgba(0,0,0,0.8);
  __border: 1px lightgrey solid;
  background-color: dodgerblue;
  font-size: x-small;
`
const CardLayout = styled.div`
  transition: all ease-in-out 0.3s;
  padding: 15px;
  row-gap: 7px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 3px 4px 12px rgba(0, 0, 0, 0.09);
  display: grid;
  border: 1px solid rgba(0, 0, 0, 0.1);
  _grid-template-rows: 1fr 0.3fr 0.5fr 1fr 3fr 0.4fr;
  grid-template-rows: minmax(10%,20%) 5% ;
  place-items: start start;

  &:hover {
    box-shadow: 4px 4px 22px rgba(0, 0, 0, 0.3);
    transform: translateY(-1%);
  }
`
const CardTag = styled.div`
  border-radius: 8px;
  padding: 2px;
  display: grid;
  place-items: center;
  border: 1px lightgrey solid;
  margin: 1px;
  width: auto;
  font-weight: lighter;
  font-size: xx-small;
  background-color: rgba(0, 0, 0, 0.03);
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 13px;
  height: 12rem;
  column-gap: 11px;

`
const AssetCardFooter = styled.div`
  place-items: center start;
  margin-top: 0.4rem;
  width: 100%;
  padding-top: 0.4rem;
  border-top: 1px solid lightgrey;
  display: grid;
  column-gap: 12px;
  grid-template-columns:1fr 1fr;

`
export {
    AssetCardFooter,
    CardLayout,
    CardGrid,
    CardCircle,
    CardTag
}
