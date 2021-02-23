import React from 'react';
import styled from 'styled-components';


const Animated = styled.svg`
width:100%;
height : ${(props) => props.height || '100%'};
animation: fadeIn 0.8s infinite alternate;
@keyframes fadeIn { 
  from { opacity: 0; } 
}
`;

const Wireframe = (props) => (
    <Animated>
        <svg>
            <line x1={'0%'} y1={'5%'} x2={'75%'} y2={'5%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            <line x1={'0%'} y1={'15%'} x2={'75%'} y2={'15%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            <line x1={'0%'} y1={'25%'} x2={'75%'} y2={'25%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            <line x1={'0%'} y1={'35%'} x2={'95%'} y2={'35%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            <line x1={'0%'} y1={'45%'} x2={'95%'} y2={'45%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            <line x1={'0%'} y1={'55%'} x2={'75%'} y2={'55%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            <line x1={'0%'} y1={'65%'} x2={'75%'} y2={'65%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            <line x1={'0%'} y1={'75%'} x2={'75%'} y2={'75%'} style={{ stroke: 'lightgray', strokeWidth: 4 }} />
            Sorry, your browser does not support inline SVG.
        </svg>
    </Animated>
);


export default Wireframe;
