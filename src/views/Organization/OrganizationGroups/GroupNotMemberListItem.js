import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation,useHistory} from "react-router-dom";


import dayjs from "dayjs";



const GroupNotMemberListItem=(props)=>{
    const notMember=props.notMember;
    const group = props.group;
    const options = [
        {value: 'Member',label:'Member'}
    ];

    if (group.userRoleInGroup=='Admin'|group.userRoleInGroup=='Owner'){
        options.push({
            label:'Admin', value:'Admin'
        })
    }

    let [role, setRole]=useState(options[0]);

    const handleSelectRole=(selectRole)=>{
        setRole(selectRole);
    }
    const addMember= ()=>{
        props.addMember({
            userName : notMember.userName,
            role : role.value
        })

    }

    return <tr>
            <td>{notMember.userName}</td>
            <td>
                <Select
                    onChange={handleSelectRole}
                    value={role}
                    options={options}/>
            </td>
            <td>
                <div onClick={addMember} className={"btn btn-sm bg-white border"}>
                    Add
                </div>
            </td>
        </tr>
}


export default GroupNotMemberListItem;
