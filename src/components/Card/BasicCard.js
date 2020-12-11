import React ,{useState } from "react"
import {Row, Container, Col} from "react-bootstrap";
import {If,Then, Else} from "react-if";
import styled from "styled-components";
import UserProfileLink from "../../views/Profile/UserProfileLink";
import ColoredCircle from "../ColoredCircle/ColoredCircle";
import TagPill  from "../TagPill/TagPill";
import dayjs from "dayjs";



const Circle=styled.div`
height:3ch;
width:3ch;
border-radius: 50%;
border: 1px solid lightseagreen;
text-align: center;
`
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
  box-shadow: 0px 6px 4px lightgrey;
  z-index:999;
}


`

const Header=styled.div`
margin-top: 2%;
height: 5ch;
color: black;
font-weight: bold;
`

const Body=styled.div`
margin-top: 12%;
#height: 12ch;
border-top: 1px solid lightgray;

`

const Footer=styled.div`
margin-top: 7%;
margin-bottom: 4%;
min-height: 10%;
_border-top: 1px solid lightgray;
display: block;
overflow:${props=>props.h?"visible":"hidden"};
transition: all 0.3s ease-in-out;

`


const EmptyFooter=styled.div`
margin-top: 7%;
margin-bottom: 4%;
min-height: 10%;
display: block;


`
const Topic=styled.div`
border-radius: 11px;
min-width: 3ch;
margin-left: 2ch;
margin-top: 1ch;
padding: 0.6ch;
font-size: 1.3ch;
text-align: center;
background-color: white;
border: darkgray solid 1px;
display:inline-block;
color: black;
`

const BasicCard = (props)=>{
    const [hovered, setHovered] = useState(false);

    return <Card h={hovered} onMouseLeave={()=>{setHovered(false)}} onMouseOver={()=>{setHovered(true)}} {...props}>
        <Header>
            <Row fluid>
                {/**<Col xs={2}><Circle className={`text-white bg-info`}><b>{props.label[0]}</b></Circle></Col>**/}
                <Col xs={2}><ColoredCircle label={props.label}><b>{props.label[0].toUpperCase()}</b></ColoredCircle></Col>
                <Col xs={10}>
                    {props.header}
                </Col>
            </Row>
            <Row>
                <Col className={`mt-1`} xs={12}>
                    <i>{props.description}</i>
                </Col>
            </Row>
            <Row>
                <Col xs={8}>
                    <small>Created by <UserProfileLink username={props.owner}/></small>
                </Col>
                <Col xs={4}>
                    <small>{dayjs(props.created).fromNow()}</small>
                </Col>
            </Row>

        </Header>
        <Body>{props.body}</Body>
        <If condition={props.tags&&props.tags.length}>
            <Then>
                <Footer className={``} h={hovered}>
                    <If condition={hovered &&props.tags&&props.tags.length}>
                        <Then>
                            <If condition={props.tags&&props.tags.length}>
                                <Then>
                                    {
                                        props.tags.map((t)=>{
                                            //return <Topic>{t}</Topic>
                                            return <TagPill label={t}>{t}</TagPill>
                                        })
                                    }
                                </Then>
                                <Else>
                                    <small> No Tag Attached</small>
                                </Else>

                            </If>
                        </Then>
                    </If>

                </Footer>

            </Then>
            <Else>
               <EmptyFooter/>
            </Else>
        </If>

    </Card>
}



export default BasicCard
