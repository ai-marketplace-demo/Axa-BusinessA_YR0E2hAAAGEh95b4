import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import styled from "styled-components"
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import addDatasetContributor from "../../../api/Dataset/addDatasetContributor";

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const NewDatasetSharee= (props)=>{

    let history = useHistory();

    let client = useClient();
    let options=[
        {
            label : 'Can Read All', value:"TotalShare",
        },
        {
            label : 'Can Discover All', value:"TotalDiscover",
        }
    ]
    let [formData,setFormData]=useState({
        userName:'',
        role:options[0]
    });

    const handleInputChange=(e)=>{
        setFormData({...formData,[e.target.name] : e.target.value})
    }
    const onSubmit=async ()=>{
        const res= await client.mutate(
            addDatasetContributor({
                userName:formData.userName,
                role : formData.role.value,
                datasetUri:props.dataset.datasetUri
            })
        )
        if (!res.errors){
            toast(`Added new contributor ${formData.userName} `,{
                hideProgressBar:true
            })
        }else {
            toast.error(`Could not add contributor, received ${res.errors[0].message}`,{
                hideProgressBar:true
            })
        }

    }

    return <Container>
        <Row className={"mt-2"}>
            <Col xs={1}>
                <Link
                    style={{color:'black'}}
                    to={'share'}>
                    <h4><Icon.ChevronLeft xs={36}/></h4>
                </Link>
            </Col>
            <Col xs={8}>
                <h4>Add New Share For Dataset</h4>
            </Col>
        </Row>
        <Row className={"mt-4"}>
            <Col xs={1}/>
            <Col xs={2}>Username</Col>
            <Col xs={4}>
                <input name={'userName'} onChange={handleInputChange} style={{width:'100%'}} value={formData.userName}/>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Col xs={1}/>
            <Col xs={2}>Role</Col>
            <Col xs={4}>
                <Select
                    name='role'
                    onChange={(selectOption)=>{handleInputChange({target:{name:'role', value:selectOption}})}}
                    value={formData.role}
                    options={options}/>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Col xs={3}/>
            <Col xs={4}>
                <div onClick={onSubmit} className={"btn-sm btn btn-primary"}>Add</div>
            </Col>
        </Row>
    </Container>
}


export default NewDatasetSharee;
