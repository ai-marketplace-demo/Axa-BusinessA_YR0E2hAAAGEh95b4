import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import Avatar from "react-avatar"
import {If,Then,Else,Case,When,Default,Switch} from "react-if";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import Tag from "../../components/Tag/Tag";
import UserProfileLink from "../../views/Profile/UserProfileLink";
import {Link,useParams,useLocation} from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)



const Circle=styled.div`
border-radius: 50%;
padding-top: 0.2ch;
width:3ch;
height:3ch;
text-align: center;
background-color: salmon;
`
const Card=styled.div`
height: 27ch;
margin-top: 6px;
border-radius: 4px;
background-color: white;
border : 1px solid lightgrey;
padding: 16px;
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 1px 2px 2px whitesmoke;
  
}
`



const EnvironmentListItem=(props)=>{
    const location = useLocation();
    const environment = props.environment
    const canLink = false;


    return <Card>
        <Row>

            <Col xs={2}>
                <Avatar round={true} size={28} value={environment.label[0].toUpperCase()}/>
            </Col>
            <Col xs={6}>
                <Link to={`/playground/${environment.environmentUri}`}>
                    <b className={`text-capitalize`}>{environment.label}</b>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>
                <Icon.Cloud/>
            </Col>
            <Col xs={10}>
                <small><code>{environment.AwsAccountId}({environment.region})</code></small>
            </Col>

        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>
                <Icon.People/>
            </Col>
            <Col xs={10}>
                <div style={{fontSize:'12px'}}> {environment.SamlGroupName}</div>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>
                <Icon.PersonCheck/>
            </Col>
            <Col xs={10}>
                <small>{environment.userRoleInEnvironment}</small>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>
                <Icon.ShieldLock/>
            </Col>
            <Col xs={10}>
                <div style={{fontSize:'12px'}}> {environment.EnvironmentDefaultIAMRoleName}</div>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>
                <Icon.Gear/>
            </Col>
            <Col xs={10}>
                <Col xs={1}>
                     <Switch>
                     <Case condition={environment.stack.status=="CREATE_COMPLETE"}>
                         <Badge pill variant={`success`}>{environment.stack.status}</Badge>
                     </Case>
                     <Case condition={environment.stack.status=="IN_PROGRESS"}>
                         <Spinner variant={`primary`} size={`sm`}/>
                     </Case>
                     <Default>
                         <Badge pill variant={`warning`}>{environment.stack.status}</Badge>
                     </Default>
                     </Switch>
                </Col>

            </Col>
        </Row>


        <Row className={`mt-2`}>
            <Col xs={12}>
                <small> Created by <UserProfileLink username={environment.owner}/> </small>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>

                <small> {dayjs(environment.created).fromNow()}</small>
            </Col>

        </Row>

    </Card>
}


export default EnvironmentListItem;
