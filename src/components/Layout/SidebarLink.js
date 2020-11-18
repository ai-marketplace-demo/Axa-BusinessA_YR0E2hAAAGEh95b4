import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components"



const StyledLink = styled.div`
font-size: 2ch;
height:3ch;
width: 97%;
margin-left: 1ch;
padding-left: 0ch;
display:inline;
float:left;
&:hover{
  #background-color: white;
  color: #24a8c9 ;
  padding-left: 1px;
  border-right: 3px #24a8c9 solid;
  font-weight: bolder;
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
a{
    outline: none! important;
    text-decoration: none;
    color:inherit;
    width:100%;
}

}


`

const SidebarLink = (props)=>{
    return <StyledLink>
        <IconStyled>{props.icon}</IconStyled>
        <LinkStyled><Link to={props.to}>{props.label}</Link></LinkStyled>
    </StyledLink>
}


export default SidebarLink;
