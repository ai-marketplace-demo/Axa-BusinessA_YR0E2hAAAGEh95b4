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
        "#009688",
        "#259b24",
        "#ff9800",
        "#ff5722",
    ];

    var hash = 0;
    if (s.length === 0) return hash;
    for (var i = 0; i < s.length; i++) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
}

const Topic=styled.div`
border-radius: 11px;
margin-left: 1.2ch;
margin-top: 2ch;
padding-left: 10%;
padding-right: 10%;
font-size: ${props=>props.size?props.size:"1.3ch"};
text-align: center;
background-color: ${props=>toColor(props.label)};
display:inline-block;
color: white;
`


const TagPill=(props)=>{
    if (!props.label) return <div/>
    return <Topic size={props.size||"1.4ch"} label={props.label}><b>{props.label}</b></Topic>
}


export default TagPill;
