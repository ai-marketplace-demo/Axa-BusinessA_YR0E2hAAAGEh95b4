import styled from "styled-components";

const _TabLink = styled.div`
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  text-align: center;
  padding-top:0.3rem;
  //margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  //display: inline-block;
  border-left: 1px lightgrey solid;
  border-top: 1px lightgrey solid;
  border-right: 1px lightgrey solid;
  //text-shadow: 1px 1px rgba(0,0,0,0.05);
    //background-color: ${props => props.active ? "white" : "rgba(0,0,0,0.01)"};
  //box-shadow: ${props => props.active ? "2px -2px 1px rgba(0,0,0,0.04)" : ""};
// border-bottom: ${props => props.active ? "2px dodgerblue solid" : ""};
  font-size: ${props => props.active ? "medium" : "small"};
  color: ${props => props.active ? "dodgerblue" : "rgba(0,0,0,0.3)"};
  font-style: ${props => props.active ? "italic" : "italic"};
  font-weight: ${props => props.active ? "bold" : "lighter"};
  //z-index:  1;
`;


const TabLink = styled.div`
border-top:1px solid lightgrey;
border-left:1px solid lightgrey;
border-right:1px solid lightgrey;
border-radius:7px 7px 0px 0px;
padding-top:0.5rem;
padding-right:0.5rem;
padding-left:0.5rem;
margin-top:2px;
color:${props=>props.active?"dodgerblue":"black"};
  font-style: ${props=>props.active?"":"italic"};
background-color:white;
border-bottom:5px solid white;
margin-bottom:${props=>props.active?"-2px":"Opx"};
text-align:center;
box-shadow:${props=>props.active?"2px -2px 1px  rgb(0,0,0,0.05)":""};
font-weight: ${props=>props.active?"bolder":"lighter"};
font-size:${props=>props.active?"small":"smaller"};
display:inline-block;
width: auto;
`;

const TabLayout=styled.div`
border-bottom:1px solid lightgrey; 
margin-bottom:1em;
margin-top:1em;
`

export {TabLink,TabLayout}
