import React from 'react';
import styled from 'styled-components';


const SearchStyled = styled.input`
        height: 2em;
        font-size: 0.9em;
        padding-left:25px;
        padding-bottom:-34px;
        border-radius: 25px;
        border : lightgrey solid 1px;
        left: 0%;
        width: 60%;
        transition: width 0.4s ease-in-out;
        &:focus{
            width:100%;
            box-shadow: 0px 0px 6px lightblue;
        }
`;


export default SearchStyled;
