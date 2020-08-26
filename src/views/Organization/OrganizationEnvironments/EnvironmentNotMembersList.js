import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation,useHistory} from "react-router-dom"
import useClient from "../../../api/client";
import listEnvironmentNotMembers from "../../../api/Environment/listEnvironmentNotMembers";
import inviteUser from "../../../api/Environment/addMember";
import EnvironmentNotMemberListItem from "./EnvironmentNotMemberListItem";
import {toast} from 'react-toastify';


const EnvironmentNotMembersList=(props)=>{
    const options = [
        { value: 'admin', label: 'Admin' },
        { value: 'contributor', label: 'Contributor' },
        { value: 'viewew', label: 'Viewer' }
    ]
    let client = useClient();
    let params= useParams();
    let location= useLocation();
    let environment = location.state.environment;
    let [ready, setReady] = useState(false);
    let [members,setMembers] = useState({count:0,nodes:[]});

    const inviteUserOnEnvironment = async ({userName, role})=>{
        toast(`inviteUserOnEnvironment  ${userName} ${role}`);
        const res= await client.mutate(
            inviteUser({
                environmentUri:environment.environmentUri,
                userName,
                role
            })
        );
        if (!res.errors){
            toast(`Added ${userName} to ${environment.label}`,{
                hideProgressBar:true
            })
        }else {
            toast.error(`Could not add user : ${res.errors[0].message}`,{
                hideProgressBar:true
            })
        }
    }

    useEffect(()=>{
        if (client){
            client
                .query(listEnvironmentNotMembers (
                    {environmentUri:environment.environmentUri}
                ))
                .then((res)=>{
                    setMembers(res.data.getEnvironment.notMembers);
                    setReady(true);
                })
        }
    },[client])

    return <Container>
        <Row>
            <Col xs={1}>
                <Row>
                    <Col className="text-left" xs={12}>
                        <Link
                            style={{color:"black"}}
                            to={{
                                state:location.state.organization,
                                pathname:`/organization/${location.state.organization.organizationUri}/environments`
                            }}><Icon.ChevronLeft size={36}/></Link>
                    </Col>
                </Row>
            </Col>
            <Col xs={9}>
                <h3>  Invite users to <b className={"text-info"}>{location.state.environment.label}</b> (in Organization <b className={"text-primary"}>{location.state.organization.label}</b>) </h3>
            </Col>

        </Row>
        <Row className={"mt-4"}>
            <Col xs={11}>
                <input className={`form-control`} placeholder={'search members'} style={{width:"100%"}}/>
            </Col>
        </Row>

        <Row className={"mt-4"}>
            <Col xs={11}>
                {
                    (!ready) ? (
                        <Spinner variant="primary" animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>

                    ) : (
                        <table className={"table table-sm"}>
                            <thead>
                            <tr>
                                <th>Username</th>
                                <th>Added</th>
                                <th>Role</th>
                                <th></th>
                            </tr>

                            </thead>
                            <tbody>
                            {
                                members.nodes.map((member)=>{
                                    return <EnvironmentNotMemberListItem
                                        key={member.userName}
                                        member={member}
                                        inviteUser={inviteUserOnEnvironment}
                                        environment={environment}
                                    />

                                })
                            }
                            </tbody>
                        </table>

                    )
                }
            </Col>

        </Row>
    </Container>
}


export default EnvironmentNotMembersList;
