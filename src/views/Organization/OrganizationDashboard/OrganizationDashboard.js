import React, {useState, useEffect} from "react";
import {Link,Redirect,Route, Switch,useParams,useLocation,useHistory} from "react-router-dom";
import {If, Then,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {toast} from "react-toastify";
import styled from "styled-components";
import {Container, Spinner,Row, Col} from "react-bootstrap";
import MainButton from "../../../components/MainActionButton/MainButton";
import Tag from "../../../components/Tag/Tag";
import useClient from "../../../api/client";
import getOrganization from "../../../api/Organization/getOrganization";
import listOrganizationTopics from "../../../api/Organization/listOrganizationTopics";
import createTopic from "../../../api/Organization/addOrUpdateOrganizationTopic";
import UserProfileLink from "../../Profile/UserProfileLink";
import EditTopicForm from "./EditTopicForm";
import NewTopicForm from "./NewTopicForm";
import OrganizationTopicList from "./OrganizationTopicList";



/**
const NewTopicForm = (props)=>{

    let client = useClient();
    let history = useHistory();
    let [formData, setFormData] = useState({label : '', description : ''})

    let handleInputChange=(e)=>{
        setFormData({...formData, [e.target.name] : e.target.value})
    }

    let saveTopic=async ()=>{
        const response = await client.mutate(
            createTopic({
                organizationUri:props.organization.organizationUri,
                input:formData
            })
        )
        if (!response.errors){
            toast(`Saved topic ${formData.label}`);
            history.goBack();
        }else {
            toast(`Could not saved ne topic, received ${response.errors[0].message}`);
        }
    }

    return <React.Fragment>
            <Row>
                <Col xs={12}>
                    <h5>Create new Topic</h5>
                </Col>
            </Row>
            <FormStyled>
                <Row>
                    <Col xs={10}>
                        Topic
                    </Col>
                    <Col xs={6}>
                        <input
                            name={`label`}
                            value={formData.label}
                            onChange={handleInputChange}
                            style={{width:'100%'}} className={`form-control`}></input>
                    </Col>
                </Row>
                <Row>
                    <Col xs={10}>
                        Description
                    </Col>
                    <Col xs={6}>
                        <input
                            name={`description`}
                            value={formData.description}
                            onChange={handleInputChange}
                            style={{width:'100%'}} className={`form-control`}>

                        </input>
                    </Col>
                </Row>
                <Row className={`mt-3`}>
                    <Col xs={4}>
                        <div className={`btn-group`}>
                            <div onClick={saveTopic} className={`btn btn-sm btn-primary`}>
                                Save
                            </div>

                            <Link to={`/organization/${props.organization.organizationUri}/dashboard/topics`}>
                                <div  className={`btn btn-sm btn-secondary`}>
                                    Cancel
                                </div>
                            </Link>

                        </div>
                    </Col>
                </Row>
            </FormStyled>
        </React.Fragment>

}

const OrganizationTopics=(props)=>{
    let client=useClient();
    let [topics, setTopics] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    })

    const fetchTopics=async ()=>{
        const response = await client.query(listOrganizationTopics({
            organizationUri:props.organization.organizationUri,
            filter:{page:topics.page}}));
        if (!response.errors){
            setTopics({...response.data.listOrganizationTopics})
        }else {
            toast(`Could not retrieve topics, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchTopics();
        }
    },[client])
    return <div>

        <Row className={`mt-4`}>
            <Col xs={4}>
                Found {topics.count} topics
            </Col>
            <Col xs={6}>
                <Row>
                    <Col xs={2}>
                        <Icon.ChevronLeft/>
                    </Col>
                    <Col xs={6}>
                        Page {topics.page}/{topics.pages}
                    </Col>
                    <Col xs={2}>
                        <Icon.ChevronRight/>
                    </Col>
                </Row>
            </Col>
            <Col xs={2}>
                <Link to={`/organization/${props.organization.organizationUri}/dashboard/newtopic`}>
                    <MainButton>Create</MainButton>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <If condition={topics.count}>
                    <Then>
                        <table className={`table table-sm`}>
                            <tr>
                                <th>
                                    Topic
                                </th>
                                <th>
                                    Description
                                </th>
                                <th>

                                </th>
                            </tr>
                            <tbody>
                            {
                                topics.nodes.map((topic)=>{
                                    return <tr>
                                        <td>
                                            {topic.label}
                                        </td>
                                        <td>
                                            {topic.description}
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>

                    </Then>
                    <Else>

                    </Else>
                </If>
            </Col>
        </Row>
    </div>
}

**/
const OrganizationDashboard= (props)=>{
    let params=useParams();
    let organizationUri=params.uri;
    let client = useClient();
    let [org, setOrg] = useState({})

    let fetchOrganization = async ()=>{
        const response = await client.query(getOrganization(organizationUri));
        if (!response.errors){
            setOrg({...response.data.getOrganization})
        }else {
            toast(`Could not retrieve organization, received ${response.errors[0].message}`)
        }
    }

    useEffect(()=>{
        if (client){
            fetchOrganization();
        }
    },[client])

    return <If condition={org}>
        <Then>
            <Container>
                <Row>
                    <Col xs={2}/>
                    <Col xs={6}>
                        <h3>Organization <b className={`text-primary text-capitalize`}>{org.label}</b></h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}>
                        <Row>
                            <Col xs={12}>
                                <Link
                                    style={{
                                        color:'black',
                                        outline:'none'
                                    }}
                                    to={`/organization/${organizationUri}/dashboard`}>
                                    About
                                </Link>
                            </Col>
                        </Row>
                        {/**
                        <Row>
                            <Col xs={12}>
                                <Link
                                    style={{
                                        color:'black',
                                        outline:'none'
                                    }}
                                    to={`/organization/${organizationUri}/dashboard/topics`}>
                                    Dataset Topics
                                </Link>
                            </Col>
                        </Row>
                         **/}
                    </Col>
                    <Col xs={10}>
                        <Switch>

                            <Route path={`/organization/${organizationUri}/dashboard`}>
                                <Row className={`mt-4`}>
                                    <Col xs={4}>
                                        <b>About</b>
                                    </Col>
                                    <Col xs={12}>
                                        {org.description}
                                    </Col>
                                </Row>
                                <Row className={`mt-4`}>
                                    <Col xs={4}>
                                        <b>Saml Admin Group Name</b>
                                    </Col>
                                    <Col xs={12}>
                                        {org.SamlGroupName}
                                    </Col>
                                </Row>
                                <Row className={`mt-4`}>
                                    <Col xs={4}>
                                        <b>Created By </b>
                                    </Col>
                                    <Col xs={12}>
                                        <UserProfileLink username={org.owner}></UserProfileLink>
                                    </Col>
                                </Row>
                                <Row className={`mt-4`}>
                                    <Col xs={4}>
                                        <b>Tags</b>
                                    </Col>
                                    <Col className={`mt-3`} xs={12}>
                                        {
                                            org.tags&&org.tags.map((tag)=>{
                                                return <Tag tag={tag}/>
                                            })
                                        }
                                    </Col>
                                </Row>

                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </Container>
        </Then>
        <Else>
            <Spinner animation={`border`} variant={`primary`}/>
        </Else>
        </If>
}

export default OrganizationDashboard
