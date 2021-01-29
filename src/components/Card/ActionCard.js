import React ,{useState } from "react"
import {Row, Container, Col} from "react-bootstrap";
import {If,Then, Else} from "react-if";
import styled from "styled-components";
import UserProfileLink from "../../views/Profile/UserProfileLink";
import ColoredCircle from "../ColoredCircle/ColoredCircle";
import TagPill  from "../TagPill/TagPill";
import * as FiIcon from "react-icons/fi";
import dayjs from "dayjs";

import * as Icon from "react-bootstrap-icons";



const Card = styled.div`
transition: transform 0.4s ease-in-out;
z-index: ${props=>props.h?11111:0};
display: inline-block;
background: white;
overflow: visible;
width : 100%;
margin-bottom: ${props=>props.h?"4em":"3em"};
__border : 1px solid lightgrey;
box-shadow: 0 5px 15px rgba(0,0,0,0.4);
height:auto;
__border-radius : 11px;
padding: 2ch;
&:hover{
  box-shadow: 0 6px 15px rgba(0,0,0,0.5);
  z-index:999;
}
`

const Header=styled.div`
margin-top: 2%;
`;

const Body=styled.div`
margin-top: 7%;
border-top: 1px solid lightgray;
`;

const Actions=styled.div`
margin-top: 7%;
margin-bottom: 4%;
min-height: 10%;
border-top: 1px solid lightgray;
display: block;
overflow:${props=>props.h?"visible":"hidden"};
transition: all 0.3s ease-in-out;

`;

const ActionCard = (props)=>{
    const [hovered, setHovered] = useState(false);

    return <Card h={hovered} onMouseLeave={()=>{setHovered(false)}} onMouseOver={()=>{setHovered(true)}} {...props}>
        <Header>
            <Row fluid>
                {/**<Col xs={2}><Circle className={`text-white bg-info`}><b>{props.label[0]}</b></Circle></Col>**/}
                <Col xs={1}><FiIcon.FiBox size={22}/></Col>
                <Col xs={10}>
                    {props.header}
                </Col>
            </Row>
            <Row className={`mt-1`}>
                {(props.description &&
                        <Col xs={12}>
                            <i>{props.description}</i>
                        </Col>
                )}
            </Row>
            <Row className={`mt-1`}>
                <Col xs={8}>
                    <small>Created by <UserProfileLink username={props.owner}/></small>
                </Col>
                <Col xs={4}>
                    <small>{dayjs(props.created).fromNow()}</small>
                </Col>
            </Row>

        </Header>
        <Body>{props.body}</Body>
        <Actions>{props.actions}</Actions>

    </Card>
}



export default ActionCard;
