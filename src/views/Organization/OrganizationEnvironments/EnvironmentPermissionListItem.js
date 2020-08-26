import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation,useHistory} from "react-router-dom"
import useClient from "../../../api/client";
import listEnvironmentMembers from "../../../api/Environment/listEnvironmentMembers";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const EnvironmentPermissionListItem=(props)=>{
    const member = props.member;
    const environment = props.environment;

    let EnvironmentPermissions=[
        'Admin',
        "DatasetCreator",
        "Invited",
        "NotInvited"
    ].map((permissionLabel)=>{
        return {label : permissionLabel, value:permissionLabel}
    })

    let options=[
        {label:member.userRoleInEnvironment, value:member.userRoleInEnvironment}
    ]
    let actionsDisabled= true;
    if (environment.userRoleInEnvironment=='Admin' | environment.userRoleInEnvironment=='Owner'){
        actionsDisabled=false;
    }
    if (member.userRoleInEnvironment=='Owner'){
        actionsDisabled=true;
    }

    let [role, setRole] = useState(options[0]);
    const changeRole=async (selectOption)=>{
        console.log(">>",selectOption);
        setRole(selectOption);
        await props.updateUserRoleInEnvironment({
            userName:member.userName,
            role : selectOption.value
        });
    }

    let leaveEnv=async (userName)=>{
        await props.leaveUser(member.userName);
    }
    return <tr>
        <td>
            {member.userName}
        </td>
        <td>
            {dayjs(member.created).fromNow()}
        </td>
        <td>
           <Select onChange={changeRole} isDisabled={actionsDisabled} options={EnvironmentPermissions} value={role}/>
        </td>
        <td>
            {
                (actionsDisabled)?(
                    <p></p>
                ):(
                    <div onClick={leaveEnv} className={"btn btn-sm border bg-white"}>Leave</div>
                )
            }
        </td>
    </tr>
}


export default EnvironmentPermissionListItem;
