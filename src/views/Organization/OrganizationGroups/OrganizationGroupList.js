import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import {Link,useParams,useLocation,useHistory} from "react-router-dom";
import { toast } from 'react-toastify';
import useClient from "../../../api/client";
import listOrganizationGroups from "../../../api/Organization/listOrganizationGroups";
import updateGroupRoleInOrganization from "../../../api/Organization/updateGroupRoleInOrganization";
import OrganizationGroupListItem from "./OrganizationGroupListItem";
import Zoom from "../../../components/Zoomer/Zoom";

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`



const OrganizationGroupList=(props)=>{
    const options = [
        { value: 'admin', label: 'Admin' },
        { value: 'contributor', label: 'Contributor' },
        { value: 'viewer', label: 'Viewer' }
    ]
    let params= useParams();
    let location= useLocation();
    let history = useHistory();
    let client = useClient();
    const organization = location.state;
    console.log("location -->", location);
    let [ready, setReady] = useState(false);
    let [groups,setGroups] = useState([]);

    const handleUpdateRole=async ({group, selectRole})=>{
        await client.mutate(updateGroupRoleInOrganization({
            organizationUri: organization.organizationUri,
            groupUri:group.groupUri,
            role:selectRole.value
        }));

    }

    useEffect(()=>{
        if (client){
            client
                .query(listOrganizationGroups({organizationUri:organization.organizationUri}))
                .then((res)=>{
                    setGroups(res.data.getOrganization.groups);
                    setReady(true);
                })
        }

    },[client])

    return <Container>
        <Row>
            <Col xs={1}>
                <Row>
                    <Col className="text-left" xs={12}>
                        <Link style={{color:"black"}} to={`/organizations`}><Icon.ChevronLeft size={36}/></Link>
                    </Col>
                </Row>
            </Col>
            <Col xs={9}>
                <h3>  Groups in Organization <b className={"text-primary"}>{location.state.label.toUpperCase()}</b></h3>
            </Col>
            <Col xs={1}>
                <Zoom color={'black'}><Icon.People size={32}/></Zoom>
            </Col>
        </Row>
        <Row className={"mt-4"}>
            <Col xs={10}>
                <input placeholder={'search groups'} style={{width:"100%"}}/>
            </Col>
            <Col xs={2}>
                <div className={"btn border btn-sm btn-white"}>
                    <Link
                        style={{color:'black'}}
                        to={{
                            state:location.state,
                            pathname:`/newgroup/${params.uri}`
                        }}><Icon.Plus size={18}/> Create</Link>
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
                        (groups.count)?(
                            <table className={"table-hover  table"}>
                                <thead>
                                <th>Name</th>
                                <th>Your Role In Group</th>
                                <th>Role In Org</th>
                                <th>Joined</th>
                                <th>Actions</th>
                                </thead>
                                <tbody>
                                {
                                    groups.nodes.map(group=>{
                                        return <OrganizationGroupListItem
                                            key={group.groupUri}
                                            updateRole={handleUpdateRole}
                                            organization={organization}
                                            group={group}
                                        />

                                    })
                                }
                                </tbody>
                                </table>

                        ):(
                            <p><i>No Groups Found</i></p>
                        )

                    )
                }
            </Col>

        </Row>
    </Container>
}


export default OrganizationGroupList;
