import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge, Form} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import styled from "styled-components"
import useClient from "../../../api/client";
import addTablePermission from "../../../api/Dataset/addTablePermission";

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const NewTablePermission= (props)=>{
    let location = useLocation();
    let history = useHistory();
    let client = useClient();

    const possibleOptions=[
        {label : 'Read', value : 'TotalShare'},
        {label : 'Discover', value : 'TotalDiscover'}
    ]

    let [formData, setFormData] = useState({consent:false,userName:'', role:possibleOptions[0]})


    const handleInputChange=(e)=>{
        setFormData({...formData, [e.target.name] : e.target.value})
    }

    const submitForm=async ()=> {
        console.log(formData);
        const res = await client.mutate(
            addTablePermission({
                userName: formData.userName,
                tableUri: location.state.table.tableUri,
                role: formData.role.value
            })
        );
        if (!res.errors) {
            history.goBack()
        } else {
            toast.error(`Could not add permission, received ${res.errors[0].message}`)
        }
    }


    return <Container>
        <Row className={`mt-1`}>
            <Col xs={2}>
                <Link
                    style={{color:'black'}}
                    to={{
                        pathname:`/dataset/${props.dataset.datasetUri}/permissions/table/${location.state.table.tableUri}`,
                        state:{
                            dataset:props.dataset,
                            table : location.state.table
                        }
                    }}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={8}>
                <h4> Add Permission To Table {location.state.table.GlueTableName}</h4>
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={2}>
                Username
            </Col>
            <Col xs={6}>
                <input style={{width:'100%'}}
                       name={'userName'} value={formData.userName}
                       value={formData.userName}
                       onChange={handleInputChange}/>
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={2}>
                Permission
            </Col>
            <Col xs={6}>
                <Select
                    value={formData.role}
                    onChange={(s)=>{handleInputChange({target: {name:'role',value:s}})}}
                    options={possibleOptions}/>
            </Col>
        </Row>
        <Row className={`mt-3`}>
            <Col xs={2}/>
            <Col xs={4}>
                <div  onClick={submitForm} className={`${formData.consent?'':'disabled'} btn btn-sm btn-success`}>Grant </div>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>

            </Col>
            <Col xs={6}>
                <Form.Check
                    checked={formData.consent}
                    name={`consent`}
                    onChange={()=>{setFormData({...formData,consent:!formData.consent})}} type="checkbox"
                    label="" />
                <i>When you grant <b>Read</b> access to an individual, you grant him access
                to access the table content, and permission to add this dataset table
                    to any of project where the user is <b>Admin</b> or <b>Owner</b>.
                </i>
            </Col>
        </Row>

    </Container>
}


export default NewTablePermission;
