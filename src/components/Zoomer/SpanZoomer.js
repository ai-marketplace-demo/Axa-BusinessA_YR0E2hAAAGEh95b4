import React from 'react';
import styled from 'styled-components';

const SpanZoomer = styled.span`
transition: transform .2s;
&:hover{
    display: inline-block;
    transform: scale(1.13);
}
cursor: pointer;
`;
export default SpanZoomer;
