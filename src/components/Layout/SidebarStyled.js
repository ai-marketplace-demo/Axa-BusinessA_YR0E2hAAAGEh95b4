import React from "react";
import styled from "styled-components";


const StylebarStyled=styled.div`
    height: 100%; /* 100% Full-height */
    width: 22%;
    max-width: 23%;
    position: fixed; /* Stay in place */
    z-index: 1; /* Stay on top */
    top: 0;
    left: 0;
    border-right : 1px lightgrey double;
    background-color: 	white;
    

    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 10px; /* Place content 60px from the top */
    transform: ${props => props.open ? 'translateX(0)' : 'translateX(-80%)'};
    transition: transform 0.4s ease-in-out;
    color : black;
    align-content: ${props=>props.open?"left":"right"};
`

export default StylebarStyled;
