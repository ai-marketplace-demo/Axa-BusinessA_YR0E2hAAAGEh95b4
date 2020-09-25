import React from "react";
import styled from "styled-components";


const Styled=styled.div`
display: inline-block;
text-align: center;
color:white;
margin-right: 1ch;
border-radius: 16px;
font-size: 0.8rem;
background-color: ${props=>props.color};
width:${props=>0.9*(2+props.tag.length)+"ch"};

`

const Tag=(props)=>{
    const stringToColour = (str)=> {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 4) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    const c = stringToColour(props.tag)
    return <Styled tag={props.tag} color={c}>
        {props.tag}
    </Styled>

}


export default Tag;
