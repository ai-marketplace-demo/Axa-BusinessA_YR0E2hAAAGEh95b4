import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation,useHistory} from "react-router-dom";
import useClient from "../../../api/client";
import listGroupMembers from "../../../api/Group/listGroupMembers";
import dayjs from "dayjs";



const GroupMemberListItem=(props)=>{
    const member=props.member;
    const group = props.group;
    let options = [
        {value: member.userRoleInGroup,label:member.userRoleInGroup}
    ];
    let selectIsDisabled=true;
    let disableLeave = false;
    if (member.userRoleInGroup=='Owner'){
        disableLeave=true;
    }else{
        if (group.userRoleInGroup=='Owner' | group.userRoleInGroup=='Admin'){
            if (options[0].value!='Admin'){
                options.push({value:'Admin', label:'Admin'})
            }
            if (options[0].value!='Member'){
                options.push({value: 'Member', label: 'Member'})
            }
            selectIsDisabled=false;
        }
    }

    let [role,setRole] = useState(options[0])

    const handleChangeRole=async (selectOption)=>{
        setRole(selectOption);
        await props.updateUserRoleInGroup({userName:member.userName, role:selectOption.value})
    }

    return <tr>
        <td>
            {member.userName}
        </td>
        <td>
            {dayjs(member.created).fromNow()}
        </td>
        <td>
            <Select
                onChange={handleChangeRole}
                isDisabled={selectIsDisabled}
                value={role}
                options={options}/>
        </td>
        <td>
            {
                (disableLeave)?(
                    <div/>
                ):(
                    <div className={`btn`}>Leave</div>
                )
            }
        </td>
    </tr>
}


export default GroupMemberListItem;
