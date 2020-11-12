import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components"



const StyledLink = styled.div`
font-size: 2ch;
height:3ch;
width: 100%;
margin-left: 9%;
padding-left: 1ch;
display:inline;
float:left;
&:hover{
  background-color: ghostwhite;
}
`

const IconStyled= styled.div`
width: 30%;
display:inline;
`

const LinkStyled= styled.div`
width:60%;
margin-left: 1ch;
display:inline;
__text-transform: uppercase;
font-size: 1.5ch;
__font-family: "Helvetica";
a{
    outline: none! important;
    text-decoration: none;
    color:black;
    width:100%;
}


`

const SidebarLink = (props)=>{
    return <StyledLink>
        <IconStyled>{props.icon}</IconStyled>
        <LinkStyled><Link to={props.to}>{props.label}</Link></LinkStyled>
    </StyledLink>
}


export default SidebarLink;
