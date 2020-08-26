import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams, useLocation} from "react-router-dom"
import useClient from "../../../api/client";
import addMember from "../../../api/Group/addMember";
import  listGroupNotMembers from "../../../api/Group/listGroupNotMembers";
import GroupNotMemberListItem from "./GroupNotMemberListItem";





const NewGroupMemberForm = (props)=>{
    let params=useParams();
    let client =useClient();
    let location = useLocation();
    console.log(">>",location.state)
    const group = location.state.group;
    let options=[{
        label: 'Member',value:'Member'
    }];

    let [ready, setReady] = useState(false);
    let[notMembers, setNotMembers] = useState({count:0,notMembers:[]});
    if (group.userRoleInGroup=='Admin'|group.userRoleInGroup=='Owner'){
        options.push({
            label: 'Admin',value:'Admin'
        })
    }


    //eslint-disable-next-line
    const handleChange=(e=>{setFormData({...formData, [e.target.name]:e.target.value})})


    const addNewMember=async ({userName, role})=>{
        console.log(userName,role);
        await client.mutate(addMember({
            groupUri: group.groupUri,
            userName: userName,
            role : role
        }))
        let refreshed= await client.query(listGroupNotMembers({groupUri:group.groupUri}));
        console.log(refreshed);
        setNotMembers(refreshed.data.getGroup.notMembers);
    }


    useEffect(()=>{
        if (client){
            client
                .query(listGroupNotMembers({groupUri:group.groupUri}))
                .then((res)=>{
                    setNotMembers(res.data.getGroup.notMembers);
                    setReady(true);
                })
        }

    },[client])
    return <Container>
        <Row>
            <Col xs={1}>
                <Link
                    style={{color:"black"}}
                    to={{
                        state:location.state,
                        pathname:`/group/${location.state.group.groupUri}/members`
                    }}><Icon.ChevronLeft size={36}/>
                </Link>
            </Col>
            <Col xs={10}>
                <h4>Add User to <b className={"text-primary"}>{`${group.label}`}</b></h4>
                </Col>
        </Row>
        <Row className={"mt-4"}>
            {
                (!ready)?(
                    <Spinner variant="primary" animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ):(
                    <Col xs={11}>
                        {

                            (notMembers.count)?(
                                <table className={"table  table-sm"}>
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Role In Group</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        notMembers.nodes.map((notMember)=>{
                                            return <GroupNotMemberListItem
                                                notMember={notMember}
                                                group={group}
                                                addMember={addNewMember}
                                                key={notMember.userName}
                                            />
                                        })
                                    }
                                    </tbody>
                                </table>
                            ):(
                                <p><i>No users to add. All organization users belong to this group</i></p>
                            )
                        }
                    </Col>

                )
            }

        </Row>
    </Container>
}


export default NewGroupMemberForm;
