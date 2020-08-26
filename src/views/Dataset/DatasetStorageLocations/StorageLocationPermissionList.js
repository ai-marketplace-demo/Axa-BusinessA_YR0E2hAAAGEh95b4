import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import StorageLocationPermissionListItem from "./StorageLocationPermissionListItem"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const StorageLocationPermissionList= (props)=>{
    const location = useLocation();
    let client = useClient();
    const [permissions, setPermissions]= useState({count:0, nodes:[]});


    useEffect(()=>{
        setPermissions({
            count : 2,
            nodes:[
                {userName : 'xxx', userRoleForLocation : 'ReadAll', created:new Date()},
                {userName : 'yyy', userRoleForLocation : 'ReadAll', created:new Date()}
            ]
        })
    },[]);

    const loc= location.state.location;
    const dataset=  location.state.dataset;
    console.log("loc =", loc);
    console.log("dataset=", dataset);
    return <Container>
        <Row>
            <Col xs={1}>
                <Link
                    style={{color:'black'}}
                    to={{
                        pathname:`/dataset/${dataset.datasetUri}/locations`
                }}>
                    <h4><Icon.ChevronLeft size={32}/></h4>
                </Link>
            </Col>
            <Col xs={9}>
                <h5>Permissions on storage location <b className={`text-primary`}>{loc.S3Prefix}</b></h5>
            </Col>
            <Col xs={2}>
                <Link to={{
                    state:{
                        location : loc
                    },
                    pathname:`/dataset/${dataset.datasetUri}/permissions/storage/${loc.locationUri}/new`
                }}>
                    <div className={"btn bg-white border btn-sm"}>
                        Grant
                    </div>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-3`}>
            <table className={`table table-sm`}>
                <thead>
                    <tr>
                        <th>
                            Username
                        </th>
                        <th>
                            Permission
                        </th>
                        <th>
                            Granted on
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    (permissions.count)?(
                        permissions.nodes.map((permission)=>{
                          return <StorageLocationPermissionListItem permission={permission}/>
                        })
                    ):(
                        <p><i>No Permissions Granted</i></p>
                    )
                }
                </tbody>
            </table>
        </Row>
    </Container>
}


export default StorageLocationPermissionList;
