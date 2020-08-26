import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import useClient from "../../../api/client";
import addDatasetLoader from "../../../api/Dataset/addDatasetLoader";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const FormStyled=styled.div`
height: 21rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`


const NewDatasetLoader= (props)=>{
    let history = useHistory();
    let client = useClient();

    let [formData,setFormData]=useState({
        IAMPrincipalArn :`arn:aws:iam::${props.dataset.AwsAccountId}:role/<ROLENAME>`,
        IAMPrincipalId :`<ROLEID>`,
        description: '',
        label :'',
        tags:[],
    });

    const handleInputChange=async (e)=>{
        setFormData({...formData,[e.target.name] : e.target.value});
    }


    useEffect(()=>{

    },[client])



    const onSubmit=async ()=>{
        const res= await client.mutate(
            addDatasetLoader({
                datasetUri:props.dataset.datasetUri,
                input:{
                    label :formData.label,
                    IAMPrincipalArn : formData.IAMPrincipalArn ,
                    //IAMPrincipalId : formData.IAMPrincipalId ,
                    description: formData.description,
                    tags: formData.tags,
                }
            })
        )
        if (!res.errors){
            toast(`Added new loader ${formData.IAMPrincipalArn} `,{
                hideProgressBar:true
            })
        }else {
            toast.error(`Could not add loader, received ${res.errors[0].message}`,{
                hideProgressBar:true
            })
        }

    }


    return <Container>
        <Row className={"mt-2"}>
            <Col xs={1}>
                <Link
                    style={{color:'black'}}
                    to={`/dataset/${props.dataset.datasetUri}/loaders`}>
                    <h4><Icon.ChevronLeft xs={36}/></h4>
                </Link>
            </Col>
            <Col xs={8}>
                <h4>Add New Loader for Dataset</h4>
            </Col>
        </Row>
        <FormStyled>
        <Row className={"mt-4"}>

            <Col xs={3}>AWS Principal Arn</Col>
            <Col xs={8}>
                <input
                    placeholder={`arn:aws:iam::account-id:role/role-name-with-path`}
                    className={"form-control"}
                    name={'IAMPrincipalArn'}
                    onChange={handleInputChange}
                    style={{width:'100%'}}
                    value={formData.IAMPrincipalArn}/>
            </Col>
        </Row>
            {/**
        <Row className={"mt-4"}>

            <Col xs={3}>Role ID</Col>
            <Col xs={8}>
                <input
                    placeholder={`arn:aws:iam::account-id:role/role-name-with-path`}
                    className={"form-control"}
                    name={'IAMPrincipalId'}
                    onChange={handleInputChange}
                    style={{width:'100%'}}
                    value={formData.IAMPrincipalId}/>
            </Col>
            </Row>
             **/}

            <Row style={{zIndex:'-1'}}className={"mt-2"}>
            <Col xs={3}>Label</Col>
            <Col xs={8}>
                <input name={'label'} onChange={handleInputChange} style={{width:'100%'}} value={formData.label}/>
            </Col>

        </Row>
        <Row style={{zIndex:'-1'}}className={"mt-2"}>
            <Col xs={3}>Description</Col>
            <Col xs={8}>
                <input name={'description'} onChange={handleInputChange} style={{width:'100%'}} value={formData.description}/>
            </Col>

        </Row>
            <Row className={"mt-2"}>
                <Col xs={3}>Tags</Col>
                <Col xs={8}>
                    <ReactTagInput
                        tags={formData.tags}
                        onChange={(newTags) => handleInputChange({target:{name:'tags', value:newTags}})}
                    />
                </Col>
            </Row>
        <Row className={"mt-2"}>
            <Col xs={3}/>
            <Col xs={4}>
                <div onClick={onSubmit} className={"btn-sm btn btn-primary"}>Add</div>
            </Col>
        </Row>
        </FormStyled>
    </Container>
}


export default NewDatasetLoader;
