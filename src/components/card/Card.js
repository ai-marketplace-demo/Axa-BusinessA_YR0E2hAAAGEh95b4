import styled from "styled-components";

const Card = styled.div`
  transition: all ease-in-out 0.3s;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 3px 4px 12px rgba(0, 0, 0, 0.09);
  display: grid;
  border: 1px solid rgba(0, 0, 0, 0.1);
  grid-template-rows: 0.1fr 0.8fr;
  grid-template-columns: repeat(100%);
  place-items: start start;

  &:hover {
    box-shadow: 4px 4px 22px rgba(0, 0, 0, 0.3);
    transform: translateY(-1%);
  }

`
const Circle = styled.div`
  width: 1.2rem;
  height: 1.2rem;

  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  //color: rgba(0,0,0,0.8);
  background-color: dodgerblue;
  font-size: x-small;
`
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.1fr;
  row-gap: 13px;
  column-gap: 11px;
`;

export {Card, Circle, CardGrid};
