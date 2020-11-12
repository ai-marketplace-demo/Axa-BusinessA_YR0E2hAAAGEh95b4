import React from "react";
import {Link} from "react-router-dom";
import {Badge, Col, Row} from "react-bootstrap";
import {If,Then,Else} from "react-if";
import Avatar from "react-avatar"
import Tag from "../../../components/Tag/Tag";
import UserProfileLink from "../../Profile/UserProfileLink";
import * as Icon from "react-bootstrap-icons";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import BasicCard from "../../../components/Card/BasicCard"
dayjs.extend(relativeTime);

const OrganizationStyled = styled.div`
border-radius: 6px;
height:19rem;
width :100%;
padding: 15px;
margin-top: 2px;
margin-bottom: 5px;
background-color: ${props=>props.color||"white"};
border: 1px solid lightgrey;
transition: transform 0.2s ease-in-out;
&:hover{
  transform: translateY(-4px);
  box-shadow: 0px 5px 2px lightgrey;

}


`

const OrganizationBody =styled.div`
height: 11rem;
`

const OrganizationTitle =styled.div`
height: 6ch;
`

const OrganizationFooter=styled.div`
height:6ch;
`

const __OrganizationListItem= (props)=>{
    const org = props.organization;
    let canGo = true;
    if (org.userRoleInOrganization == 'NotMember'){
        canGo=false;
    }
    let canEdit=['Owner','Admin'].indexOf(org.userRoleInOrganization)!=-1


    const openArchiveOrganizationModal= ()=>{
        props.openArchiveOrganizationModal&&props.openArchiveOrganizationModal(org);
    }
    return <Col className="" xs={4}>
        <OrganizationStyled color={`${canGo?"white":"ghostwhite"}`}>

            <OrganizationTitle>
            <Row className={`mt-2`}>
                <Col xs={2}>
                    <Avatar className={`mr-3`} size={28} round={true} name={org.label}/>
                </Col>
                <Col xs={7}>
                    <h6 className={"ml-2"}><b>{org.label.toUpperCase()}</b></h6>
                </Col>

                <Col xs={1}>
                    <If condition={canEdit}>
                        <Then>
                            <Link
                                className="text-black"
                                to={{
                                    state:{organization:org},
                                    pathname:`/editorganization/${org.organizationUri}`
                                }}><Icon.Pen/></Link>
                        </Then>
                    </If>
                </Col>
                <Col xs={1}>
                    <If condition={canEdit}>
                        <Then>
                            <Link to={"#"}>
                                <Icon.Archive  onClick={openArchiveOrganizationModal}className={`text-danger`}/>
                            </Link>
                        </Then>
                    </If>
                </Col>
            </Row>
            </OrganizationTitle>
            <OrganizationBody>
            <Row className={`mt-1`}>
                <Col xs={2}></Col>
                <Col xs={10}>
                    <i style={{fontSize:'14px'}}>{org.description||'No description available'}</i>
                </Col>
            </Row>
            <Row className={`mt-1`}>
                <Col className={`pt-1`} xs={2}>
                    <Icon.InfoCircle/>
                </Col>
                <Col xs={4}>
                    <Link to={{state:org,pathname:`/organization/${org.organizationUri}/dashboard`}}>
                        <small>About</small>
                    </Link>
                </Col>

            </Row>


            <Row>
                <Col xs={2}>
                    <Icon.PersonCheck/>
                </Col>
                <Col xs={4}>
                    <small>{org.userRoleInOrganization}</small>
                </Col>
            </Row>
            <Row>
                <Col className={`pt-1`} xs={2}>
                    <Icon.Cloud/>
                </Col>
                <Col xs={4}>
                    <Link to={{state:org,pathname:`/organization/${org.organizationUri}/environments`}}>
                        <small>Environments({org.stats.environments})</small>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={2}>
                    <Icon.People className={`pt-1`} ></Icon.People>
                </Col>

                <Col  xs={4}>
                    <small>{org.SamlGroupName}</small>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <small>Created by <UserProfileLink username={org.owner}/></small>
                </Col>
                <Col xs={12}>
                    <small>{dayjs(org.created).fromNow()}</small>
                </Col>
            </Row>
            </OrganizationBody>
            <OrganizationFooter>
            <Row className={`mt-2 pt-2 pb-2 border-top`}>
                <Col className={`mt-1`}>
                    {org.tags.map((t)=>{
                        return <Tag tag={t}/>
                    })}
                </Col>
            </Row>
            </OrganizationFooter>

        </OrganizationStyled>

    </Col>

}



const Header = (props)=>{
    const org = props.org;
    const canEdit =props.canEdit;
    return <Row>
        <Col xs={8}>
            <b>{org.label.toUpperCase()}</b>
        </Col>
        <Col xs={1}>
            <If condition={canEdit}>
                <Then>
                    <Link
                        className="text-black"
                        to={{
                            state:{organization:org},
                            pathname:`/editorganization/${org.organizationUri}`
                        }}><Icon.Pen colors={`black`} size={12}/></Link>
                </Then>
            </If>
        </Col>
        <Col xs={1}>
            <If condition={canEdit}>
                <Then>
                    <Link to={"#"}>
                        <Icon.Archive size={12} onClick={props.openArchiveOrganizationModal}/>
                    </Link>
                </Then>
            </If>
        </Col>
    </Row>
}


const Body=(props)=>{
    const org = props.org;
    return <div>

        <Row className={`mt-3`}>
            <Col className={`pt-1`} xs={2}>
                <Icon.InfoCircle/>
            </Col>
            <Col xs={4}>
                <Link to={{state:org,pathname:`/organization/${org.organizationUri}/dashboard`}}>
                    <small>About</small>
                </Link>
            </Col>

        </Row>


        <Row>
            <Col xs={2}>
                <Icon.PersonCheck/>
            </Col>
            <Col xs={4}>
                <Badge pill variant={`primary`}>{org.userRoleInOrganization}</Badge>
            </Col>
        </Row>
        <Row>
            <Col className={`pt-1`} xs={2}>
                <Icon.Cloud/>
            </Col>
            <Col xs={4}>
                <Link to={{state:org,pathname:`/organization/${org.organizationUri}/environments`}}>
                    <small>Environments({org.stats&&org.stats.environments})</small>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.People className={`pt-1`} ></Icon.People>
            </Col>

            <Col  xs={4}>
                <small>{org.SamlGroupName}</small>
            </Col>
        </Row>
    </div>

}

const OrganizationListItem= (props)=>{
    const org = props.organization;
    let canGo = true;
    if (org.userRoleInOrganization == 'NotMember'){
        canGo=false;
    }
    let canEdit=['Owner','Admin'].indexOf(org.userRoleInOrganization)!=-1;
    const openArchiveOrganizationModal= ()=>{
        props.openArchiveOrganizationModal&&props.openArchiveOrganizationModal(org);
    }



    const header=<Header org={props.organization} canEdit={canEdit} openArchiveOrganizationModal={openArchiveOrganizationModal}/>
    const body= <Body org={props.organization}/>

    return <BasicCard
        topics={["a","b","x"]}
        height={`43ch`}
        label={org.label.toUpperCase()}
        description={org.description}
        tags={org.tags}
        header={header}
        body={body}
        owner={org.owner}
        created={org.created}
        header={header}
    />
}

export default OrganizationListItem;
