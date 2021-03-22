import styled from "styled-components";


const GridStyle = styled.div`
    display:grid;
    grid-template-columns: ${props => props.cols ? props.cols : "auto"};
    grid-template-rows: ${props => props.rows ? props.rows : "auto"};
    place-items: ${props => props.align ? props.align : "start"};
    grid-row-gap: ${props => props.spacing ? props.spacing.y : ""};
    grid-column-gap: ${props => props.spacing ? props.spacing.x : ""};
    
`

const GridElementStyle = styled.div`
    grid-column-start: ${props => props.start ? props.start : ""};
    grid-column-end: ${props => props.end ? props.end : ""};
    justify-content: ${props => props.align ? props.align : ""} ;

`

const Grid = (props) => {
    return <GridStyle {...props}/>
}
const GridElement = (props) => {
    return <GridElementStyle {...props}/>
}

export {Grid, GridElement};
