import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge,Dropdown} from "react-bootstrap";
import Select from "react-select";
import {If, Then, Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import Tag from "../../../components/Tag/Tag";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const StorageLocationListItem= (props)=>{
    const required_permissions=[
        'BusinessOwner',
        'Admin',
        'DataSteward',
        'Creator'
    ];
    let canRemove= false;
    if (required_permissions.indexOf(props.dataset.userRoleForDataset)!=-1 ){
        canRemove =true;
    }
    const remove=async ()=>{
        await props.delete({locationUri:props.location.locationUri})
    }
    return <tr>
        <td>{props.location.S3Prefix}</td>
        <td><i>{`s3://${props.dataset.S3BucketName}/${props.location.S3Prefix}`}</i></td>
        <td>{dayjs(props.location.created).fromNow()}</td>
        <td>
            <If condition={canRemove}>
                <Then>
                    <div className={`btn btn-sm bg-white border`} onClick={remove}> Remove</div>
                </Then>
            </If>
        </td>
    </tr>

}


export default StorageLocationListItem;
