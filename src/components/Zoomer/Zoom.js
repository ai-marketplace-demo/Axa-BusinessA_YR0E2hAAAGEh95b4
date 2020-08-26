
import React from "react";
import styled from "styled-components";


const Zoom=styled.div`
    transition: transform .2s;
    width:100%;
    transform-origin: ${props=>props.origin||"top left"};
    text-decoration: none !important;
    -webkit-box-shadow: none!important;
    box-shadow: none!important;
      text-underline: none;
&:hover{
  transform: ${props=>props.scale?`scale(${props.scale})`:"scale(1.3)"};
  color : ${props=>props.color||"yellow"};
  text-decoration: none;
}
`


export default Zoom;
