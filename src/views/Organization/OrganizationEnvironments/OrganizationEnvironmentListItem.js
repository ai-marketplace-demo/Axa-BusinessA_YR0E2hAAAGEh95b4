import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import Avatar from "react-avatar"
import {If,Then,Else,Case,Switch,Default} from "react-if";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import Tag from "../../../components/Tag/Tag";
import UserProfileLink from "../../../views/Profile/UserProfileLink";
import {Link,useParams,useLocation} from "react-router-dom"
import BasicCard from "../../../components/Card/BasicCard";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)




const Header=(props)=>{
    const environment= props.environment;
    return <Row>
        <Col xs={8}>
            <Link to={`/playground/${environment.environmentUri}`}>
                <b className={`text-capitalize`}>{environment.label}</b>
            </Link>
        </Col>
        <Col xs={2}>
            <Icon.Archive onClick={props.onDisplayArchiveModal} size={12} />
        </Col>
    </Row>
}


const Body=(props)=>{
    const environment=props.environment;
    return <div>
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
                <Badge pill variant={`primary`}><small>{environment.userRoleInEnvironment}</small></Badge>
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
                <Switch>
                    <Case condition={environment.stack.status=="CREATE_COMPLETE"}>
                        <Badge variant={"success"} pill><small>{environment.stack.status}</small></Badge>
                    </Case>
                    <Case condition={environment.stack.status=="CREATE_IN_PROGRESS" || environment.stack.status=="STARTING"}>
                        <Spinner variant={`primary`} animation={`border`} size={`sm`}/>
                    </Case>
                    <Default>
                        <Badge variant={"warning"} pill>{environment.stack.status}</Badge>
                    </Default>
                </Switch>
            </Col>
        </Row>

    </div>
}

const OrganizationEnvironmentListItem=(props)=>{
    const location = useLocation();
    const environment = props.environment
    const organization = props.organization ;
    const canEdit = ['Owner','Admin'].indexOf(environment.userRoleInEnvironment)!=-1

    const onDisplayArchiveModal=()=>{
        props.onDisplayArchiveModal&&props.onDisplayArchiveModal(environment)
    }


    const header=<Header environment={environment} onDisplayArchiveModal={onDisplayArchiveModal}/>
    const body=<Body environment={environment}/>
    return <BasicCard
        label={environment.label}
        tags={environment.tags||[]}
        owner={environment.owner}
        header={header}
        body={body}
        created={environment.created}
        description={environment.description}
        />

}


export default OrganizationEnvironmentListItem;
