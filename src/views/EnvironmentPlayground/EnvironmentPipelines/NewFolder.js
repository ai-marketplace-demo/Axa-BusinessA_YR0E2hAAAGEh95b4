import React, {useState, useEffect} from "react";
import {Container, Row, Col, Base, Spinner} from "react-bootstrap";
import {Link,useLocation,useParams} from "react-router-dom";
import {If, Then, Else} from "react-if";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import useClient from "../../../api/client";
import addProjectPipelineNode from "../../../api/Project/addProjectPipelineNode";

import {toast} from"react-toastify"



const Background=styled.div`
height: 8rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightcoral;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`

const NewFolder= (props)=>{
    let client=useClient();
    let [formData, setFormData] = useState({
        label:""
    })
    let location = useLocation();

    let pipeline= location.state.pipeline;
    let parentFolder= location.state.parentFolder

    const handleInputChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const submitForm=async ()=>{
        const response = await client.mutate(addProjectPipelineNode({
            pipelineUri : pipeline.pipelineUri,
            input:{...formData,nodeType:'Folder',parentFolderUri:parentFolder?parentFolder.nodeUri:""}
        }));
        if (!response.errors){
            toast(`Created new folder`)
        }else {
            toast(`Could not create new folder!, recieved ${response.errors[0].message}`)
        }

    }


    return <Container>
        <Row>
            <Col xs={1}>
                <Link
                    style={{color:'black'}}
                    to={{
                        state:{pipeline},
                        pathname:`/project/${props.project.projectUri}/pipeline/${pipeline.pipelineUri}`
                    }}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={8}>
                <If condition={parentFolder!=null}>
                    <Then>
                        <h4> Create a new folder for <b className={`text-primary`}>{pipeline.label}</b> in {parentFolder&&parentFolder.label}</h4>
                    </Then>
                    <Else>
                        <Then>
                            <h4> Create a new folder for <b className={`text-primary`}>{pipeline.label}</b></h4>
                        </Then>

                    </Else>
                </If>

            </Col>
        </Row>
        <Background>
        <Row>
            <Col xs={1}>
                <h5>Name</h5>
            </Col>
            <Col xs={8}>
                <input name={`label`} onChange={handleInputChange} value={formData.label} className={`form-control`}/>
            </Col>
        </Row>
            <Row className={`mt-4`}>
                <Col xs={1}></Col>
                <Col xs={3}>
                    <div onClick={submitForm} className={`btn btn-primary`}>Create</div>
                </Col>
            </Row>
        </Background>
    </Container>


}

export default NewFolder;
