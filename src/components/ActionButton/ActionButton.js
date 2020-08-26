import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Zoom from "../Zoomer/Zoom";
import {Col, Container, Row} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const Menu = styled.div`
position:absolute;
z-index: ${props=>props.zIndex||1};
visibility: ${props=>props.visibility||"hidden"};
width:220px;
border-radius: 6px;
margin: 0px;
border : solid 1px gainsboro;
background-color: white;
__padding : 1px;
box-shadow: 0px 5px 2px 1px lightgrey;

.menu-item{
  padding-left : 9px;
  __width:219px;
}
.menu-item:hover{
  __width:210px;
  background-color: honeydew;
  __border-radius: 6px;
  font-weight: bold;  
  border-left: solid 2px gainsboro;
  border-right: solid 2px gainsboro;
}
.menu-item>a{
    text-decoration: none;
    color : black;
}
}

`

class ActionButton extends React.Component{
    constructor(props){
        super(props);
        this.state={
            visibility: "hidden",
            zIndex:0
        }
        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.node = React.createRef();
    }

    handleClick(event){
        if (this.node.current.contains(event.target)) {
            // inside click
            console.log("clicked inside")
            return
        }else{
            console.log("clicked outside")
           if (this.state.visibility=="visible"){
               this.setState({
                   visibility : "hidden"
               })
           }
        }
    }

    toggleMenu(){
        console.log("toggleMenu cliecked");
        this.setState({
            visibility : (this.state.visibility == "hidden")?"visible":"hidden"
        },()=>{
            console.log("new state = ", this.state);
        })
    }

    componentDidMount(){
        document.addEventListener("click", this.handleClick);

    }
    componentWillUnmount(){
        document.removeEventListener("click", this.handleClick)
    }

    render(){
        return <div ref={this.node}>
            <Zoom color={"black"}>
                <Icon.ThreeDotsVertical onClick={()=>{this.toggleMenu()}}/>
            </Zoom>

            <Menu  {...this.state}>
                {React.Children.map(this.props.children,(child)=>{
                    return <div className={"menu-item"}>{child}</div>;
                })}
            </Menu>
        </div>
    }
}



export default ActionButton;
