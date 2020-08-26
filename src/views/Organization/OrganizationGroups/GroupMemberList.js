import React ,{useState,useEffect} from "react";
import {toast} from "react-toastify";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import Tabs from "../../../components/Tabs/Tabs";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation,useHistory} from "react-router-dom";
import useClient from "../../../api/client";
import listGroupMembers from "../../../api/Group/listGroupMembers";
import updateMemberRole from "../../../api/Group/updateMemberRole";
import GroupMemberListItem from "./GroupMemberListItem";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';dayjs.extend(relativeTime)


const GroupMemberList=(props)=>{
    let params= useParams();
    let client= useClient();
    let location= useLocation();
    let [ready, setReady] = useState(false);
    let [members,setMembers] = useState([]);
    const group =location.state.group;
    useEffect(()=>{
        if (client){
            client
                .query(listGroupMembers({groupUri:group.groupUri}))
                .then((res)=>{
                    console.log("res = ", res);
                    setMembers(res.data.getGroup.members)
                    setReady(true);
                })
        }
    },[client])

    const updateUserRoleInGroup=async ({userName,role})=>{
        await client.mutate(updateMemberRole({groupUri:group.groupUri, userName:userName, role:role}));
        toast(`Update role of ${userName} to ${role}`,{hideProgressBar:true})
    }

    return <Container>
        <Row>
            <Col xs={1}>
                <Row>
                    <Col className="text-left" xs={12}>
                        <Link
                            style={{color:"black"}}
                            to={{
                                state:location.state.organization,
                                pathname:`/organization/${location.state.organization.organizationUri}/groups`
                            }}><Icon.ChevronLeft size={36}/>
                        </Link>
                    </Col>
                </Row>
            </Col>
            <Col xs={10}>
                <h3>  Members of group <b className={"text-info"}>{location.state.group.label}</b>(in Organization <b className={"text-primary"}>{location.state.organization.label}</b>) </h3>
            </Col>
        </Row>
        <Row className={"mt-4"}>
            <Col xs={10}>
                <input placeholder={'search members'} style={{width:"100%"}}/>
            </Col>
            <Col xs={2}>
                <div className={"btn border btn-sm btn-white"}>
                    {
                        (group.userRoleInGroup=='Owner'|group.userRoleInGroup=='Admin')?(
                            <Link
                                style={{color:'black'}}
                                to={{
                                    state:location.state,
                                    pathname:`/newgroupmember/${params.uri}`}}>
                                <Icon.Plus size={18}/> Invite
                            </Link>
                        ):(
                            <React.Fragment/>
                        )
                    }

                </div>
            </Col>
        </Row>
        <Row className={"mt-4"}>
            <Col xs={11}>
                {
                    (!ready)?(
                        <Spinner variant="primary" animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>

                    ):(
                        (members.count)?(
                        <table className={"table-hover table-sm table"}>
                            <thead>
                            <tr>
                                <th>
                                    Username
                                </th>
                                <th>
                                    Joined
                                </th>
                                <th>
                                    Role
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                members.nodes.map((member)=>{
                                    return <GroupMemberListItem
                                        group={group}
                                        updateUserRoleInGroup={updateUserRoleInGroup}
                                        key={member.userName}
                                        member={member}/>
                                })
                            }
                            </tbody>


                        </table>
                        ):(
                            <p><i>No Members in this group</i></p>

                        )
                    )
                }
            </Col>

        </Row>
    </Container>
}


export default GroupMemberList;
