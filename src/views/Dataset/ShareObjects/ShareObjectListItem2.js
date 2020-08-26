import React, {useState,useEffect} from "react";
import {If,Then,Else,Switch,Case,Default} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {Row,Col,Container,Badge,Spinner} from "react-bootstrap";
import Select from "react-select";
import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import useClient from "../../../api/client";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import styled from "styled-components";
import Tag from "../../../components/Tag/Tag";
dayjs.extend(relativeTime)


const Circle=styled.div`
border-radius: 50%;
#padding-top: 0.7ch;
width:3ch;
height:3ch;
text-align: center;
background-color: lightskyblue;
padding-bottom:2ch ;
color:white;
`

const Card=styled.div`
height: 32ch;
margin-top: 6px;
border-radius: 4px;
background-color: white;
color: black;
border : 1px solid lightgrey;
padding: 8px;
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 1px 2px 2px whitesmoke;
  
}
`
const ShareObjectListItem=(props)=>{
    return <Card>
        <Row>
            <Col style={{color:`lightblue`}} xs={2}>
                <Circle>{props.shareObject.principal.organizationName[0]}</Circle>
            </Col>
            <Col xs={8}>
                <small><b>{props.shareObject.principal.organizationName}/{props.shareObject.principal.SamlGroupName}</b></small>
            </Col>
        </Row>
        <Row>
            <Col xs={6}>
                <div className={`text-dark`} style={{fontSize:'12px'}}> {props.shareObject.status}</div>
            </Col>
        </Row>

        <Row>

            <Col xs={12}>
                <small>
                    <Link to={`/playground/${props.shareObject.principal.principalId}`}>
                        <code>{props.shareObject.principal.AwsAccountId}</code> / {props.shareObject.principal.SamlGroupName} / {props.shareObject.principal.region}
                    </Link>
                </small>
            </Col>
        </Row>
        <Row>
            <Col xs={4}>
                <small>Requested By :</small>
            </Col>
            <Col xs={6}>
                <small> <p className={`text-primary`}>{props.shareObject.owner}</p></small>
            </Col>
            <Col xs={12}>
            </Col>
            <Col xs={2}>
                <Icon.House className={`pt-2`}size={24}/>
            </Col>
            <Col xs={10}>
                {props.shareObject.principal.organizationName}
            </Col>
            <Col xs={2}>
                <Icon.Cloud className={`pt-2`}size={24}/>
            </Col>
            <Col xs={10}>
                <code>{props.shareObject.principal.AwsAccountId}</code>
            </Col>
            <Col xs={2}>
                <Icon.Flag className={`pt-2`}size={24}/>
            </Col>
            <Col xs={10}>
                <code>{props.shareObject.principal.region}</code>
            </Col>
            <Col xs={2}>
                <Icon.People className={`pt-2`}size={24}/>
            </Col>
            <Col xs={10}>
                {props.shareObject.principal.SamlGroupName}
            </Col>
            <Col xs={2}>
                <Icon.Calendar className={`pt-2`} size={18}/>
            </Col>
            <Col xs={10}>
                <small>{dayjs(props.shareObject.created).fromNow()}</small>
            </Col>

        </Row>

        <Row className={`mt-4`}>
            <Col className={`rounded `}xs={6}>
                <Link
                    style={{
                        color:`black`
                    }}
                    to={{
                        pathname:`/dataset/${props.dataset.datasetUri}/share/${props.shareObject.shareUri}`,
                        state:{
                            shareObject : props.shareObject,
                            dataset:props.dataset
                        }
                    }}>
                     <small className={`border px-2`}>Manage</small>
                </Link>
            </Col>
        </Row>



    </Card>



}

export default ShareObjectListItem;
