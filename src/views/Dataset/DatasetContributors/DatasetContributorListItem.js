import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import {toast} from 'react-toastify';

import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import dayjs from "dayjs";
import { If, Then, Else, When, Unless, Case, Default } from 'react-if';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const DatasetContributorListItem= (props)=>{
    const options=[
        {label: 'Admin',value:'Admin'},
        {label: 'ReadWrite',value:'ReadWrite'}
    ];
    const permission = props.permission;
    let canChange= true;
    if (permission.userRoleForDataset=='Owner'){
        canChange=false;
    }
    let [role, setRole] = useState({value:permission.userRoleForDataset,label:permission.userRoleForDataset});

    const updateRole= async (select)=>{
        const res = await props.updateContributorRole({
            userName:permission.userName,
            role : select.value
        })
        setRole(select);
    }
    const canEdit = (['Owner','Admin'].indexOf(props.dataset.userRoleForDataset)!=-1)
    const remove= async ()=>{
        await props.removeContributor({userName:permission.userName})
    }
    return <tr>
        <td>{permission.userName}</td>
        <td>{permission.userRoleInEnvironment}</td>
        <td>
            <If condition={canEdit}>
                <Then>
                    <Select
                        isDisabled={!canChange}
                        value={role}
                        options={options}
                        onChange={updateRole}
                    />
                </Then>
                <Else>
                    {role.label}
                </Else>
            </If>

        </td>
        <td>{dayjs(permission.created).fromNow()}</td>
        <td>
            <If condition={canEdit}>
                <Then>
                    <If condition={canChange}>
                        <Then>
                            <div onClick={remove} className={"btn-sm btn bg-white border"}>Remove</div>
                        </Then>
                    </If>
                </Then>
            </If>
        </td>
    </tr>

}


export default DatasetContributorListItem;
