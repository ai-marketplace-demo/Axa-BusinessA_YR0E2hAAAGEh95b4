import React ,{useState} from "react";
import { gql } from "apollo-boost";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import {Link,useParams,useHistory} from "react-router-dom"
import { Planet,File, Backpack ,Browser} from 'react-kawaii'
import { toast } from 'react-toastify';
import useClient from "../../api/client";
import createOrganization from "../../api/Organization/createOrganization";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

const FormStyled=styled.div`
border: 1px lightgrey solid;
margin-top: 0px;
border-radius: 0px Opx 5px 5px;
border-left: 7px solid lightblue;
padding: 3em;
width:80%;
box-shadow: 0px 1px 0px 2px lightyellow;
`

const NewOrganizationForm = (props)=>{
    let params=useParams();
    let history = useHistory();
    let [ready, setReady] = useState(false);
    let[formData, setFormData] = useState({
        label:'',
        description : '',
        SamlGroupName:'',
        tags:[]
    });


    let client = useClient();


    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name] : e.target.value})
    }

    const submitForm=async ()=>{
        await client.mutate(createOrganization(formData))
        history.goBack();
    }

    return <Container>
        <Row>
            <Col xs={1}>
                <Link style={{color:"black"}} to={`/organizations`}><Icon.ChevronLeft size={36}/></Link>
            </Col>
            <Col xs={10}>
                <h3>Create Your Organization <b className={`text-primary`}>{formData.label}</b></h3>
            </Col>
        </Row>
        <FormStyled>
            <Row>
                <Col className="" xs={3}><h6><b>Name</b></h6></Col>
                <Col xs={5}>
                    <input className={`form-control`} onChange={handleChange} name="label" value={formData.label} placeholder={"enter an organization name"} style={{width:'100%'}}/>
                </Col>

            </Row>
            <Row className={`mt-1`}>
                <Col className="pt-2" xs={3}><h6><b>Description</b></h6></Col>
                <Col xs={5}>
                    <input className={`form-control`} onChange={handleChange} name="description" value={formData.description} placeholder={""} style={{width:'100%'}}/>
                </Col>
            </Row>
            <Row className={`mt-1`}>
                <Col className="pt-2" xs={3}><h6><b>Admin Group </b></h6></Col>
                <Col xs={5}>
                    <input
                        className={`form-control`}
                        onChange={handleChange}
                        name="SamlGroupName"
                        value={formData.SamlGroupName}
                        placeholder={"SAML Group Name for admins"}
                        style={{width:'100%'}}/>
                </Col>
            </Row>

            <Row className={"mt-2"}>
                <Col className="pt-2" xs={3}><h6><b>Tags</b></h6></Col>
                <Col xs={8}>
                    <ReactTagInput
                        tags={formData.tags}
                        onChange={(newTags) => handleChange({target:{name:'tags', value:newTags}})}
                    />
                </Col>
            </Row>

            <Row className={"mt-3"}>
                <Col xs={3}/>
                <Col xs={2}>
                    <div onClick={submitForm} className={"btn btn-primary"}>
                        Create
                    </div>
                </Col>
            </Row>
        </FormStyled>
    </Container>
}


export default NewOrganizationForm;
