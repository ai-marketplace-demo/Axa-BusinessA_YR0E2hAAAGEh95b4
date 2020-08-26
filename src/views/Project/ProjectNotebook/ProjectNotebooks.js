import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components";
import {toast} from "react-toastify";
import MainButton from "../../../components/MainActionButton/MainButton"
import useClient from "../../../api/client";
import listProjectNotebooks  from "../../../api/Project/listProjectNotebooks";
import NotebookItem from "./NotebookItem";

const Styled=styled.div`
height:100vh;
`

const ProjectNotebooks =(props)=>{
    const client = useClient();
    let [notebooks, setNotebooks] = useState({
        count : 0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious :false,
        nodes:[]
    })

    const fetchItems=async ()=>{
        const response=await client.query(
            listProjectNotebooks({projectUri:props.project.projectUri, filter:{page:1,pageSize:5}})
        )
        if (!response.errors){
            toast("Retrieved notebooks "+response.data.getProject.notebooks.count)
            setNotebooks({...response.data.getProject.notebooks})
        }else {
            toast(`Could not retrieve notebooks for project`);

        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])

    return <Styled>
        <Container>
        <Row>
            <Col xs={12}><h4><Icon.FileCode/> Project Notebooks</h4></Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={4}><i>Found {notebooks.count} notebook(s)</i></Col>
            <Col xs={5}>
                <Row>
                    <Col className={`text-right mt-2`} xs={2}><Icon.ChevronLeft/></Col>
                    <Col className={`text-left`}xs={6}><i>Page {notebooks.page} /{notebooks.pages}</i></Col>
                    <Col className={`mt-2`} xs={2}><Icon.ChevronRight/></Col>
                </Row>
            </Col>
            <Col xs={2}>
                <Link to={`/project/${props.project.projectUri}/newnotebook`}>
                    <MainButton>Create</MainButton>
                </Link>
            </Col>
        </Row>
        <Row>
            {/**
             gql.Field(name="region", type=gql.String),
             gql.Field(name="AwsAccountId", type=gql.String),
             gql.Field(name="S3BucketName", type=gql.String),
             gql.Field(name="S3Prefix", type=gql.String),
             gql.Field(name="S3AccessPointName", type=gql.String)
             ]
             **/}
            <Col className={`mt-4`} xs={12}>
                <table className={"table"}>
                    <tr>
                        <th>
                            Notebook
                        </th>
                        <th>
                            Status
                        </th>
                        <th>
                            Connect
                        </th>

                        <th>
                            Stop/Start
                        </th>
                    </tr>
                    {
                        notebooks.nodes.map((notebook)=>{
                            return <NotebookItem notebook={notebook}/>
                        })
                    }
                </table>
            </Col>
        </Row>
    </Container>
    </Styled>

}


export default ProjectNotebooks
