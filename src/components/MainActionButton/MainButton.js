import React from 'react';
import styled from 'styled-components';


const MainActionButton = styled.div`
border-radius : 23px;
height : 4ch;
padding : 2px;
padding-top : 4px;
margin-top: 3px;
color : white;
width:13ch;
text-align: center;

 background: ${(props) => (props.secondary ? 'lightsteelblue' : 'lightseagreen')};
__border : 1px solid lightgray;
transition: transform 0.2s ease-in-out;
&:hover{
   transform: translateY(-3px);
    box-shadow: darkgray 2px 0px 2px;
    text-decoration:none; 
  }

a{
    font-size: 0.9em;
    margin-top: 0;
    outline: 0;
    color : white;
    text-decoration: none;
    font-weight: lighter;
}
a:link, a:visited,a:hover{
    text-decoration:none; 
    outline: 0;
}

`;


export default MainActionButton;
