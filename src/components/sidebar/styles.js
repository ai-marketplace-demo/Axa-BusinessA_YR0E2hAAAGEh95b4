import styled from "styled-components";

const SidebarLayout = styled.div`
  transition: all ease-in-out 2s;
  display: grid;
  padding-left: 1ch;
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.05);
  border-right: 1px solid lightgrey;
  grid-template-rows: 20% 70% 10%;
`;

const SidebarItemsLayout = styled.div`
    overflow-y: scroll;
    scrollbar-width: none;
    overflow-x: hidden;
    display: grid;
    grid-template-rows: repeat(auto-fit,1.9rem);
    row-gap: 0.2rem;
  ::-webkit-scrollbar {
    width: 0;
  }
`
const SidebarItemsSpacer = styled.div`
    background-color: white;
`


const GroupEntry = styled.div`
  transition: transform ease-in-out 0.3s;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr 1fr;
  grid-template-rows: 1fr;
  place-items: center start;

  margin-left: ${props => props.level ? `${props.level}em` : ''};
  font-size: ${props => props.level ? `smaller` : `small`};

  &:hover {
    transform: translateX(3%);
  }
`;


const MenuHeaderEntry = styled.div`
  display: grid;
  font-size: larger;
  font-weight: bolder;
  margin-top: 1rem;
  padding-bottom: 2rem;
  width: 100%;
  place-items: center;
  grid-template-columns: 6fr 1fr 0.2fr;
  grid-template-rows: auto;
`
export {
    SidebarLayout,
    SidebarItemsLayout,
    SidebarItemsSpacer,
    MenuHeaderEntry,
    GroupEntry

}
