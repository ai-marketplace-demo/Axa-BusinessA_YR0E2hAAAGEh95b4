import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge,Dropdown} from "react-bootstrap";
import Select from "react-select";
import Tag from "../../../components/Tag/Tag";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const TableListItem= (props)=>{
    const required_permissions=[
        'Owner',
        'Admin',
        'ReadWrite'
    ];
    let actionsDisabled= true;
    if (required_permissions.indexOf(props.dataset.userRoleForDataset)!=-1 ){
        actionsDisabled =false;
    }
    const remove=async ()=>{
        await props.delete({locationUri:props.location.locationUri})
    }
    return <tr>
        <td><Link to={`/table/${props.table.dataset.datasetUri}/${props.table.tableUri}`}>{props.table.tableUri}</Link></td>
        <td><b>{props.table.GlueTableName}</b></td>
        <td>{dayjs(props.table.created).fromNow()}</td>
        {/**<td><Tag tag={props.table.userRoleForTable&&props.table.userRoleForTable||"unknown"}/></td>**/}
        {/**
            <td>{
            (actionsDisabled)?(
                <div></div>
            ):(
                <Dropdown>
                    <Dropdown.Toggle size="sm" variant={'primary'}>
                        Actions
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={remove}>Remove</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                            <Link
                                to={{
                                    state:{
                                        table: props.table,
                                        dataset: props.dataset
                                    },
                                    pathname :`/dataset/${props.dataset.datasetUri}/permissions/table/${props.table.tableUri}`
                                }}
                            >
                                Manage Permissions
                            </Link>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        }</td>
        **/}
    </tr>

}


export default TableListItem;
