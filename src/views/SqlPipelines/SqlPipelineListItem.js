import React ,{useState, useEffect} from "react";
import {Container,Row, Col, Badge,ListGroupItem,ListGroup,Dropdown,Table,Card} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Zoom from "../../components/Zoomer/Zoom";
import Tag from "../../components/Tag/Tag";
import styled from "styled-components";
import ActionButton from "../../components/ActionButton/ActionButton";
import { Sparklines,SparklinesBars } from 'react-sparklines';
import {BrowserRouter, Route,Link, Switch} from "react-router-dom";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import Avatar from "react-avatar";
dayjs.extend(relativeTime)

const Styled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:15rem;
margin-top: 7px;
padding: 1em;
border : 1px solid gainsboro;
border-radius: 8px;

a{
  color :black;
  outline: 0;
}
a:hover, a:link, a:visited{
  text-decoration:none;
  color :black;
}
}
`;







const SqlPipelineListItem = (props)=>{
    return <Styled>
        <Row className={``}>
            <Col xs={8}>
                <Link to={`/sqlpipeline/${props.sqlPipeline.sqlPipelineUri}`}>
                    <p>
                        <Avatar className={`mr-1`} size={32} round={true} name={props.sqlPipeline.label}/> <b className={"text-capitalize"}>{props.sqlPipeline.label}</b>
                    </p>
                </Link>
            </Col>
            <Col xs={12}>
                <b>{props.sqlPipeline.description.slice(0,25)}</b>
            </Col>
        </Row>

        <Row className={`mt-1`}>
            <Col xs={4}><Icon.Person></Icon.Person></Col>
            <Col xs={8}>
                <small>{props.sqlPipeline.owner} </small>
            </Col>
            <Col xs={4}><Icon.People></Icon.People></Col>
            <Col xs={8}>
                <small>{props.sqlPipeline.SamlGroupName} </small>
            </Col>
            <Col xs={4}><Icon.PersonCheck></Icon.PersonCheck></Col>
            <Col xs={8}>
                <small>{props.sqlPipeline.userRoleInSqlPipeline} </small>
            </Col>
            <Col xs={4}><Icon.Flag></Icon.Flag></Col>
            <Col xs={8}>
                <small>{props.sqlPipeline.region} </small>
            </Col>
            <Col xs={4}><Icon.House></Icon.House></Col>
            <Col xs={8}>
                <small> {props.sqlPipeline.organization.label}</small>
            </Col>
            <Col xs={4}><Icon.Gear/></Col>
            <Col xs={8}>
                <small> {props.sqlPipeline.stack.status}</small>
            </Col>

        </Row>

        <Row className={`mt-2 border-top`}>
            {
                props.sqlPipeline.tags.map((tag)=>{
                    return <Col className={`ml-1 mt-1 pr-2`} xs={3}>
                        <Badge className={`ml-1`} variant={`secondary`}  >{tag}</Badge>
                    </Col>
                })
            }
        </Row>
        <Row>
            <div style={{height:`200px`}}/>
        </Row>
    </Styled>
}

export default SqlPipelineListItem

