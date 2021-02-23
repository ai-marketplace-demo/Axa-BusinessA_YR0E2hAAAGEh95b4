import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';


const TileStyled = styled.div`
  width: 90%;
  height: 100px;
  margin: 10px;
  __position: relative;

  &:before{
      __z-index: -1;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 90%;
      border-radius: 5px;
      height: 100px;
      border : 1px lightgrey solid;
      background: #F0F0F0;
      transform-origin: center;
      transition: all 0.4s ease-in-out;
  }
  &:hover:before{
    transform: scaleY(1.26) ;
  }
  
`;


const Tile = (props) => {
    const [hovered, setHovered] = useState(false);
    const enter = () => {
        console.log('enter');
        setHovered(true);
    };
    const exit = () => {
        console.log('exit');
        setHovered(false);
    };
    return (
        <TileStyled onMouseOver={enter} onMouseOut={exit}>
            <h2>hello l</h2>
        </TileStyled>
    );
};

/**
 *
 {
            React.Children.map(props.children,(child)=>{
                console.log("==> child = ", child);
                return React.cloneElement(child,{hovered:hovered})
            })
        }

 */

export default Tile;
