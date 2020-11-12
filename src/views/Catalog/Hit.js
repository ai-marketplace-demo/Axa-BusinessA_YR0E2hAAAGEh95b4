import React, {useState, useEffect} from "react";
import { Row, Col,Badge} from "react-bootstrap";
import {If,Then,Else,Switch,Case} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {Link, } from "react-router-dom";
import styled from "styled-components";
import Avatar from "react-avatar"
import Zoom from "../../components/Zoomer/Zoom";
import Tag from "../../components/Tag/Tag";
import dayjs from "dayjs";
import UserProfileLink from "../../views/Profile/UserProfileLink";

const HitStyled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-3px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:14rem;
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




const Hit = (props)=>{
    let    [regions, setRegions] =useState([

        { label:'US East (Ohio)', value:'us-east-2'},
        { label:'US East (N. Virginia)', value:'us-east-1'},
        { label:'US West (N. California)', value:'us-west-1'},
        { label:'US West (Oregon)', value:'us-west-2'},
        { label:'Africa (Cape Town)', value:'af-south-1'},
        { label:'Asia Pacific (Hong Kong)', value:'ap-east-1'},
        { label:'Asia Pacific (Mumbai)', value:'ap-south-1'},
        { label:'Asia Pacific (Osaka-Local)', value:'ap-northeast-3'},
        { label:'Asia Pacific (Seoul)', value:'ap-northeast-2'},
        { label:'Asia Pacific (Singapore)', value:'ap-southeast-1'},
        { label:'Asia Pacific (Sydney)', value:'ap-southeast-2'},
        { label:'Asia Pacific (Tokyo)', value:'ap-northeast-1'},
        { label:'Canada (Central)', value:'ca-central-1'},
        { label:'China (Beijing)', value:'cn-north-1'},
        { label:'China (Ningxia)', value:'cn-northwest-1'},
        { label:'Europe (Frankfurt)', value:'eu-central-1'},
        { label:'Europe (Ireland)', value:'eu-west-1'},
        { label:'Europe (London)', value:'eu-west-2'},
        { label:'Europe (Milan)', value:'eu-south-1'},
        { label:'Europe (Paris)', value:'eu-west-3'},
        { label:'Europe (Stockholm)', value:'eu-north-1'},
        { label:'Middle East (Bahrain)', value:'me-south-1'},
        { label:'South America (São Paulo)', value:'sa-east-1'},
        { label:'AWS GovCloud (US-East)', value:'us-gov-east-1'},
        { label:'AWS GovCloud (US)', value:'us-gov-west-1'},
    ]);
    const hit = props.node;
    return <Row className={``}>
            <Col xs={12}>
                <HitStyled>
                    <Row>

                        <Col xs={8}>
                            <Row>
                                <Col xs={1}>
                                    <Avatar className={`mr-1`} size={32} round={true} name={hit.label}/>
                                </Col>
                                <Col xs={9}>
                                    <h5>
                                        <Link to={`/dataset/${hit.datasetUri}/overview`}>
                                            {hit.label}
                                        </Link>
                                    </h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={1}/>
                                <Col xs={11}>
                                    <p> {hit.description.slice(0,200)}</p>
                                </Col>
                            </Row>
                            <Row className={`mt-1`}>
                                <Col xs={1}/>

                                <Col xs={8}>
                                    {
                                        hit.tags.map((tag)=>{
                                            return <Tag tag={tag}/>
                                        })
                                    }
                                </Col>
                            </Row>
                            <Row className={`mt-2`}>
                                <Col xs={1}/>
                                <Col xs={4}>
                                    <Icon.Table size={12}/> {hit.statistics.tables} tables
                                </Col>
                                <Col xs={6}>
                                    <Icon.Folder size={12}/> {hit.statistics.locations} locations
                                </Col>
                            </Row>




                        </Col>
                        <Col xs={4}>
                            <Row>
                                <Col xs={12}>
                                    <Badge pill variant={`primary`} className={`pt-1`}> {hit.userRoleForDataset}</Badge>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small>Created by <UserProfileLink username={hit.owner}/> {dayjs(hit.created).fromNow()}</small>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small> Org:<b> {hit.organization.label}</b></small>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small> Env:<b> {hit.environment.label}</b></small>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small>Region:<b> {regions.find((r)=>{
                                        return (r.value==hit.region);
                                    }).label}</b></small>
                                </Col>
                            </Row>
                            <Row className={`mt-2`}>
                                <Col className={``} xs={12}>
                                    <Link
                                        target="_blank"
                                        style={{color:'white'}}
                                        state={{
                                            dataset : hit
                                        }}
                                        to={{
                                            pathname:`/dataset/${hit.datasetUri}/shares`
                                        }}>
                                        <div  style={{width: "7rem"}} className={"btn btn-sm btn-primary border rounded-pill"}>
                                         Get It
                                        </div>

                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </HitStyled>
            </Col>
    </Row>

}


export default Hit;
