import React, {useState, useEffect} from "react";
import {Container, Row, Col, Table, Spinner, Badge} from "react-bootstrap";
import {If, Then , Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import listDatasetStorageLocations from "../../../api/Dataset/listDatasetStorageLocations";
import useClient from "../../../api/client";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const DatasetShareListItem = (props)=>{
    const share = props.share;
    return <tr>
        <td>
            {share.shareUri}
        </td>
        <td>
            {share.principal.organizationName}
        </td>
        <td>
            <Icon.People/> {share.principal.SamlGroupName}
        </td>
        <td>
            {share.principal.AwsAccountId}
        </td>
        <td>
            {share.principal.region}
        </td>
        <td>
            {dayjs(share.created).fromNow()}
        </td>
        <td>
            <Badge className={` bg-white border`} variant={`secondary`} pill>
                <small>{share.status}</small>
            </Badge>
        </td>
        <td>
            <Link to={`/access-request/${share.shareUri}`}>
                <div className={`btn rounded-pill btn-sm btn-info`}>
                    Manage
                </div>
            </Link>
        </td>
    </tr>

}


export default  DatasetShareListItem;
