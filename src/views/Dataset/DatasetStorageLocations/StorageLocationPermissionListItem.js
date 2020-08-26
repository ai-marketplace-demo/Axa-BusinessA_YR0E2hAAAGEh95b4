import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import listDatasetStorageLocations from "../../../api/Dataset/listDatasetStorageLocations";
import updateDatasetContributor from "../../../api/Dataset/updateDatasetContributor";
import deleteDatasetStorageLocation from "../../../api/Dataset/removeDatasetStorageLocation";
import StorageLocationListItem from "./StorageLocationListItem";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const StorageLocationPermissionListItem= (props)=>{
    const location = useLocation();
    let client = useClient();
    const [permissions, setPermissions]= useState({count:0, permissions:[]});


    const possibleOptions=[
        {label : 'Read', value : 'Read'},
        {label : 'Discover', value : 'Discover'}
    ]

    useEffect(()=>{

    })
    return <tr>
        <td>
            {props.permission.userName}
        </td>
        <td>
            <Select options={possibleOptions}/>
            {/**{props.permission.userRoleForLocation}**/}
        </td>
        <td>
            {dayjs(props.permission.created).fromNow()}
        </td>
        <td>
            <div className={"btn btn-sm bg-white border"}>
                Remove
            </div>
        </td>
    </tr>
}


export default StorageLocationPermissionListItem;
