import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import useClient from "../../../api/client";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const TablePermissionListItem= (props)=>{
    const location = useLocation();
    let client = useClient();


    const possibleOptions=[
        {label : 'Read', value : 'TotalShare'},
        {label : 'Discover', value : 'TotalDiscover'}
    ]
    let [role, setRole] = useState(props.permission.role=='TotalShare'?possibleOptions[0]:possibleOptions[1]);


    const remove=async()=>{
        await props.removePermission({userName:props.permission.userName})

    }
    const updateRole=async (selectOption)=>{
        setRole(selectOption);
        props.updatePermission({userName:props.permission.userName, role:selectOption.value})
    };
    return <tr>
        <td>
            {props.permission.userName}
        </td>
        <td>
            <Select
                value={role}
                onChange={updateRole}
                options={possibleOptions}
            />
        </td>
        <td>
            {dayjs(props.permission.created).fromNow()}
        </td>
        <td>
            <div
                onClick={remove}
                className={"btn btn-sm bg-white border"}>
                Remove
            </div>
        </td>
    </tr>
}


export default TablePermissionListItem;
