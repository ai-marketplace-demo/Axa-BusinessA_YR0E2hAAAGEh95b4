import React from 'react';
import styled from 'styled-components';


const MainStyled = styled.div`
    transition: margin-left 0.4s ease-in-out;;
    #transition: width 0.4s ease-in-out;;
    padding-top: 10px; /* Place content 60px from the top */
    __padding-left:10px;
    __overflow:hidden;
    __border-right: 6px double red ;
    margin-left: ${(props) => (props.sidebar ? '26vw' : 'Ovw')};
    #width : ${(props) => (props.sidebar ? '74vw' : '100vw')}

`;


export default MainStyled;
