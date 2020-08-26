import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import styled from "styled-components"
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import createDatasetTable from "../../../api/Dataset/addDatasetTable";

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const NewTable= (props)=>{

    let client = useClient();
    let history = useHistory();

    let [formData, setFormData] = useState({
        label:'sss',
        name:'',
        config:'',
        description:'',
        tags:[]
    })

    const handleInputChange = (e)=>{
        setFormData({...formData, [e.target.name] : e.target.value})
    }
    const submitForm=async ()=>{
        console.log(">...",formData);
        const input = formData
        const res = await client.mutate(
            createDatasetTable({datasetUri:props.dataset.datasetUri,input:input})
        )
        if (!res.errors){
            toast("Created new location",{hideProgressBar:true,onClose:()=>{history.goBack()}})
        }else{
            toast.error(`Could not create new location, received ${res.errors[0].message}`,{hideProgressBar:true})
        }

    }

    return <Container>
        <Row>
            <Col xs={2}>
                <Link style={{color:'black'}} to={"tables"}>
                    <h4><Icon.ChevronLeft/></h4>
                </Link>
            </Col>
            <Col xs={8}>
                <h5>Create New Table</h5>
            </Col>
        </Row>

        <Row className={`mt-4`}>
            <Col xs={2}>
                Name
            </Col>
            <Col xs={6}>
                <input name={`name`} value={formData.name} onChange={handleInputChange} style={{width:'100%'}} />
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Table Config
            </Col>
            <Col xs={6}>
                <textarea style={{fontFaily:'Courier New', fontSize:'0.8rem',backgroundColor:'black',color:'yellow'}}
                          value={formData.config} className={"form-control"}
                          name={`config`}
                          onChange={handleInputChange}
                          rows={5}>

                </textarea>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Description
            </Col>
            <Col xs={6}>
                <input name={`description`} value={formData.description} onChange={handleInputChange} style={{width:'100%'}} />
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Tags
            </Col>
            <Col xs={6}>
                <input style={{width:'100%'}} />
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>

            </Col>
            <Col xs={6}>
                <div onClick={submitForm} className={"btn btn-primary btn-sm"}>Add</div>
            </Col>
        </Row>
    </Container>
}


export default NewTable;
