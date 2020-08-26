import React ,{useState} from "react";
import {Link} from "react-router-dom";
import {Badge, td, Row} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import styled from "styled-components";
import Select from "react-select";
import useClient from "../../../api/client";
import {toast} from "react-toastify";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';dayjs.extend(relativeTime)

const OrganizationGroupListItem= (props)=>{
    const group= props.group;
    const organization = props.organization;
    let options={};
    let selectValue={};
    let selectDisabled=false;
    let leaveDisabled=false;
    let [role,setRole] = useState({value:group.groupRoleInOrganization,label:group.groupRoleInOrganization});
    if (group.groupRoleInOrganization=='Owner'){
        options = [
            { value: 'Owner', label: 'Owner' }
        ]
        selectValue=options[0];
        leaveDisabled= true;
        selectDisabled=true;
    }else if (group.groupRoleInOrganization=='Admin'){
        options = [
            { value: 'Admin', label: 'Admin' },
            { value: 'Member', label: 'Member' },
        ]
        selectValue=options[0];
    }else if (group.groupRoleInOrganization=='Member'){
        options = [
            { value: 'Member', label: 'Member' },
            { value: 'Admin', label: 'Admin' }
        ]
        selectValue=options[0];
    }
    if (organization.groupRoleInOrganization=='Member'){
        leaveDisabled=true;
        options=[{
            label: group.groupRoleInOrganization, value : group.groupRoleInOrganization
        }]
        selectValue=options[0];
        selectDisabled = true;
    }


    console.log("GROUP = ", group);
    const leave=()=>{
        props.leave({groupName:group.groupName})
    }

    const handleRoleChange=async (selectOption)=>{
        await props.updateRole({group:group, selectRole:selectOption})
        setRole(selectOption);
        toast(
            `Updated ${group.label} Role to ${selectOption.label}` ,
            {
                autoClose: 2000,
                hideProgressBar: true
            })
    }


    return <tr className={"mt-2"}>
        <td className={'mt-1'} xs={2}>
            <div className={"text-capitalize pl-2"}>
                {group.label}
            </div>
        </td>
        <td xs={1}>
            <Badge variant={'primary'}>{group.userRoleInGroup}</Badge>
        </td>
        <td xs={3}><Select onChange={handleRoleChange} isDisabled={selectDisabled} value={role} options={options} /></td>
        <td xs={2}><small>Created {dayjs(group.created).fromNow()}</small></td>
        <td xs={2}>
            <div className={"btn-group"}>
                {
                    (leaveDisabled)?(
                        <div></div>
                    ):(
                        <div className={"btn-group"}>
                            <div onClick={leave} className={`ml-1  border btn btn-sm`}> leave</div>

                            <Link to={{
                                state:{group,organization},
                                pathname:`/group/${group.groupUri}/members/members`
                            }}>
                                <div className={`ml-1  border btn btn-sm`}> members</div>
                            </Link>

                        </div>
                    )
                }
            </div>
        </td>

    </tr>
}

export default OrganizationGroupListItem;
