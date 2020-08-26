import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import styled from "styled-components"
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import addDatasetStorageLocation from "../../../api/Dataset/addDatasetStorageLocation";

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const NewLocationPermission= (props)=>{
    let location = useLocation();
    const orgs=[
        {label : 'myorg', value:'myorg'},
        {label : 'myotherorg', value:'myotherorg'}
    ];

    const users=[
        {label : 'moshir', value:'moshir'},
        {label : 'amine', value:'amine'},
        {label : 'joseph', value:'joseph'},
    ];

    const possibleOptions=[
        {label : 'Read', value : 'Read'},
        {label : 'Discover', value : 'Discover'}
    ]

    return <Container>
        <Row className={`mt-1`}>
            <Col xs={2}>
                <Link
                    style={{color:'black'}}
                    to={{
                        pathname:`/dataset/${props.dataset.datasetUri}/permissions/storage/${location.state.location.locationUri}`,
                        state:{
                            dataset:props.dataset,
                            location : location.state.location
                        }
                    }}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={8}>
                <h4> Add Permission To Storage Location</h4>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Organization
            </Col>
            <Col xs={6}>
                <Select options={orgs}/>
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={2}>
                Username
            </Col>
            <Col xs={6}>
                <Select options={users}/>
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={2}>
                Permission
            </Col>
            <Col xs={6}>
                <Select options={possibleOptions}/>
            </Col>
        </Row>
        <Row className={`mt-3`}>
            <Col xs={2}/>
            <Col xs={4}>
                <div className={"btn btn-sm btn-success"}>Grant </div>
            </Col>
        </Row>

    </Container>
}


export default NewLocationPermission;
