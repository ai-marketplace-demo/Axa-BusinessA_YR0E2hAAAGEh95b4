import styled from "styled-components";

const Title= styled.div`
    display: grid;
    padding: 12px;
    place-items: center start ;
    grid-template-columns: auto auto 5fr 1fr 0.2fr;
    column-gap: 0.1fr;
`


const MainLayout = styled.div`
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr
`

const TitleLayout = styled.div`
    display:block;
`

const ComponentLayout = styled.div`
    display: block;
`



const EditorControlsLayout = styled.div`
    grid-template-columns: repeat(3,10%) 1fr  20% ;
    display: grid;
`;
const EditorLayout = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    border-bottom: 1px solid lightgrey;
`

const ResultLayout = styled.div`
    display: block;
    overflow-y: scroll;
    grid-template-rows: auto;
`

export {
    Title,
    MainLayout,
    TitleLayout,
    ResultLayout,
    EditorLayout,
    EditorControlsLayout,
    ComponentLayout

}
