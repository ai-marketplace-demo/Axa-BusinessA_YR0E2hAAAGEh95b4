import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const ProjectContributorListItem= (props)=>{
    const options=[
        {label: 'Admin',value:'Admin'},
        {label: 'Contributor',value:'Contributor'}
    ];
    const permission = props.permission;
    let canChange= true;
    if (permission.userRoleInProject=='Owner'){
        canChange=false;
    }
    let [role, setRole] = useState({value:permission.userRoleInProject,label:permission.userRoleInProject});

    const updateRole= async (select)=>{
        await props.updateContributorRole({
            userName:permission.userName,
            role : select.value
        })

        setRole(select);
    }

    const remove= async ()=>{
        await props.removeContributor({userName:permission.userName})
    }
    return <tr>
        <td>{permission.userName}</td>
        <td>{permission.userRoleInEnvironment}</td>
        <td>
            <Select
                isDisabled={!canChange}
                value={role}
                options={options}
                onChange={updateRole}
            />
        </td>
        <td>{dayjs(permission.created).fromNow()}</td>
        <td>
            {
                (canChange)?(
                    <div onClick={remove} className={"btn-sm btn bg-white border"}>Remove</div>

                ):(
                    <div></div>
                )

            }
        </td>
    </tr>

}


export default ProjectContributorListItem;
