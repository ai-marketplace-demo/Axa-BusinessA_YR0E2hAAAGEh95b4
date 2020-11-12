import React from "react";
import styled from "styled-components";

const toColor=(s)=>{
    if (!s){return "white"}
    var colors = [
        "#e51c23",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#5677fc",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#259b24",
        "#8bc34a",
        "#afb42b",
        "#ff9800",
        "#ff5722", ];

    var hash = 0;
    if (s.length === 0) return hash;
    for (var i = 0; i < s.length; i++) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
}

const ColoredCircle = styled.div`
height:3.3ch;
width:3.3ch;
border-radius: 50%;
_border: 1px solid lightseagreen;
background-color: ${props=>toColor(props.label)};
#text-align: center;
display:flex;
align-items: center; 
justify-content: center;
color: white;
`;




export default ColoredCircle;
