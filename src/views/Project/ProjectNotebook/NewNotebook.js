import React, {useState, useEffect} from "react";
import {Container, Row, Col, Base, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import useClient from "../../../api/client";
import createNotebook from "../../../api/Project/createNotebook";
import {toast} from"react-toastify"



const Background=styled.div`
height: 8rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid #24a8c9;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`

const NewNotebook= (props)=>{
    let client=useClient();
    let [formData, setFormData] = useState({
        NotebookInstanceName:""
    })

    const handleInputChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const submitForm=async ()=>{
        const response = await client.mutate(createNotebook({
            projectUri : props.project.projectUri,
            input:formData
        }));
        if (!response.errors){
            toast(`Creating new notebook`)
        }else {
            toast(`Could not create new notebook!`)
        }

    }

    useEffect(()=>{
    },[client])

    return <Container>
        <Row>
            <Col xs={1}>
                <Link style={{color:'black'}} to={`/project/${props.project.projectUri}/notebooks`}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={4}>

                <h4> Create a new Notebook</h4>
            </Col>
        </Row>
        <Background>
        <Row>
            <Col xs={1}>
                <h5>Name</h5>
            </Col>
            <Col xs={8}>
                <input name={`NotebookInstanceName`} onChange={handleInputChange} value={formData.NotebookInstanceName}className={`form-control`}/>
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

export default NewNotebook;
