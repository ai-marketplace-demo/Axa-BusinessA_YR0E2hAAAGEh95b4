import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import EasyEdit, {Types} from 'react-easy-edit';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import {toast} from 'react-toastify';
import styled from "styled-components"
import useClient from "../../api/client";
import updateProject from "../../api/Project/updateProject";
import getProject from "../../api/Project/getProject";

const OverviewStyled=styled.div`
height:60vh;
margin-top: 6px;
#border-radius: 0px;
#background-color: white;
#border : 1px solid lightgrey;
#border-left:  4px solid lightseagreen;
#box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`

const ProjectOverView= (props)=>{

    let client =useClient();
    let params= useParams();
    console.log("ProjectOverView =>", props);

    let [details, setDetails]=useState({
        projectUri : "",
        label : "",
        tags : [],
        description : ''
    })

    const handleEdit=(field)=>{
        return (value)=>{
            setDetails({...details,[field]:value})
        }
    }

    const setTags=(tags)=>{
        setDetails({...details, tags:tags});
    }

    const updateDetails=async ()=>{
        const response=await client.mutate(
            updateProject({
                projectUri:props.project.projectUri,
                input:{
                    label:details.label,
                    tags:details.tags,
                    description:details.description
                }
            })
        );
        if (!response.errors){
            toast.info(`Update project ${props.project.label}`);
            setDetails({...details, ...response.data.updateProject})
        }
    }


    useEffect(()=>{
        if (client){
            client
                .query(getProject(params.uri))
                .then((response)=>{
                    setDetails({...response.data.getProject})
                })
        }
    },[client])
    return <Container>
        <Row>
            <Col xs={12}>
                <h4>Overview of project <b className={`text-primary`}>{props.project.label}</b> ({props.project.projectUri})</h4>
            </Col>
        </Row>
        <OverviewStyled>
            <Row>
                <Col xs={3}>
                    <b>uri</b>
                </Col>
                <Col xs={8}>
                    <code>{props.project.projectUri}</code>
                </Col>
            </Row>
            <Row>

            <Col xs={3}>
                <b>Description</b>
            </Col>
            <Col xs={8}>
                <EasyEdit
                    attributes={{name:'description'}}
                    type={Types.TEXT}
                    onSave={handleEdit('description')}
                    value={props.project.description}
                >
                </EasyEdit>

            </Col>
        </Row>
        <Row>
            <Col xs={3}>
                <b>Owner</b>
            </Col>
            <Col xs={8}>
                {props.project.owner}
            </Col>
        </Row>
        <Row>
            <Col xs={3}>
                <b>Environment</b>
            </Col>
            <Col xs={8}>
                <Link to={{
                    state:{
                        organization : props.project.organization,
                        environment : props.project.environment
                    },
                    pathname:`/playground/${props.project.environment.environmentUri}`
                }}>
                    {props.project.environment.label}({props.project.environment.AwsAccountId}/{props.project.environment.region})
                </Link>
            </Col>
        </Row>
            <Row>
                <Col xs={3}>
                    <b>Tags</b>
                </Col>
                <Col xs={9}>
                    <ReactTagInput
                        tags={details.tags}
                        onChange={setTags}
                    />

                </Col>
            </Row>
            <Row className={`mt-3`}>
                <Col xs={3}>
                    <div onClick={updateDetails} className={"btn btn-sm btn-success"}>Save</div>
                </Col>
                <Col xs={9}>
                </Col>
            </Row>

        </OverviewStyled>
    </Container>
}


export default ProjectOverView;
