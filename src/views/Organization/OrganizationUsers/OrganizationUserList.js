import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import MainActionButton from "../../../components/MainActionButton/MainButton";
import {Link,useParams,useLocation} from "react-router-dom"
import Zoom from "../../../components/Zoomer/Zoom";
import {toast} from "react-toastify";
import OrganizationUserListItem from "./OrganizationUserListItem";
import useClient from "../../../api/client";
import listOrganizationUsers from "../../../api/Organization/listOrganizationUsers";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import updateUserRole from "../../../api/Organization/updateUserRole";
import removeUser from "../../../api/Organization/removeUser";
dayjs.extend(relativeTime)

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 8px 3px  lightgrey;
padding: 16px;
`



const OrganizationUserList=(props)=>{
    const options = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Member', label: 'Member' },
        { value: 'Owner', label: 'Owner' }
    ]
    let client = useClient();
    let params= useParams();
    let location = useLocation();
    let [ready, setReady] = useState(false);
    let [users,setUsers] = useState({
        count:0,
        nodes:[],
        page:1,
        hasNext:false,
        hasPrevious:false,
        pageSize:4,
        pages:0
    });
    let [sortCriterias, setSortCriterias] = useState({userName:'asc',created:'desc'})
    let [search, setSearch] = useState("");
    let [organization, setOrganization] = useState({})
    let [inviteEnabled,setInviteEnabled]=useState(false) ;

    const fetchItems = async ()=>{
        const response = await client
            .query(
                listOrganizationUsers({
                    organizationUri:params.uri,
                    filter:{
                        pageSize:users.pageSize,
                        page:users.page,
                        sort:Object.keys(sortCriterias).map((k)=>{ return {field:k, direction : sortCriterias[k]}}),
                        term : search
                    }
                })
            )
        if (!response.errors){
            setUsers(response.data.getOrganization.users);
            setOrganization(response.data.getOrganization);
            let role = response.data.getOrganization.userRoleInOrganization;
            setInviteEnabled(['Owner','Admin'].indexOf(role)!=-1)
        }else {
            toast(`Could not retrieve users for organization${params.uri}, received ${response.errors[0].message}`)
        }
        setReady(true);
    }

    const handleChangeSort =async (field)=>{
        setSortCriterias({...sortCriterias,[field]:sortCriterias[field]=='asc'?'desc':'asc'});
        await fetchItems();
    }



    const handleUpdateRole=async ({userName,selectRole})=>{
        await client.mutate(
            updateUserRole({
                organizationUri:params.uri,
                userName:userName,
                role:selectRole.value
            })
        )

    }

    const handleLeave=async ({userName})=>{
        const response = await client.mutate(removeUser({input:{
                organizationUri : organization.organizationUri,
                userName :userName
            }}))
        if (!response.errors){
            toast(`Removed user ${userName} from org`);
            if (users.page==1){
                fetchItems()
                return ;
            }
            setUsers({...users, page:1})
        }else{
            toast(`Could not remove user ${userName} from org, received ${response.errors[0].message}`)
        }

    }
    const handleSearch=async (e)=>{
        if (e.key === 'Enter') {
            if (users.page>1){
                setUsers({...users, page:1})
            }else {
                await fetchItems();
            }
        }

    }
    const handleInputChange=(e=>setSearch(e.target.value))



    const nextPage =()=>{
        if(users.hasNext){
            setUsers({...users, page:users.page+1})
        }
    }

    const prevPage=()=>{
        if(users.hasPrevious){
            setUsers({...users, page:users.page-1})
        }
    }

    useEffect( ()=>{
        if (client){
            fetchItems();
        }
        return ()=>{}

    },[client, users.page])

    if (!ready){
        return <Spinner variant={`primary`} animation={`grow`}/>
    }
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
                <h3>   <Icon.Person size={32}/> Registered Users in Organization <b className={"text-primary"}>{organization.label.toUpperCase()}</b></h3>
            </Col>

        </Row>
        <Row className={`mt-3`}>
            <Col xs={3}><i>Found <b>{users.count}</b> results</i></Col>
            <Col xs={4}>
                <Row>
                    <Col xs={1}>
                        {(users.hasPrevious)?(
                            <Icon.ChevronLeft className={`mt-2`} onClick={prevPage}/>
                        ):(
                            <div/>
                        )}
                    </Col>
                    <Col xs={3}>
                        Page {users.page}/{users.pages}
                    </Col>
                    <Col xs={1}>
                        {(users.hasNext)?(
                            <Icon.ChevronRight className={`mt-2`} onClick={nextPage}/>
                        ):(
                            <div/>
                        )}
                    </Col>
                </Row>
            </Col>
            <Col xs={2}/>
            <Col xs={2}>
                {
                    (inviteEnabled)?(
                        <MainActionButton>

                        <Link  to={{
                                pathname:`/newuser/${params.uri}`,
                                state:organization
                            }}>
                                    Invite
                            </Link>
                        </MainActionButton>
                    ):(
                        <div></div>
                    )
                }
            </Col>
            <Col className={`mt-2`} xs={12}>
                <input className={`form-control`} onKeyDown={handleSearch} value={search} onChange={handleInputChange} placeholder={'search users'} style={{width:"100%"}}/>
            </Col>
        </Row>

        <Row className={"mt-4"}>
            <Col xs={12}>
            {
                (!ready)?(
                    <Spinner variant="primary" animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>

                ):(
                    <div>

                        <table className={"table table-hover"}>
                        <thead>
                        <tr>
                            <th>
                                User
                            </th>
                            <th>
                                Role In Organization
                            </th>
                            <th>
                                Joined
                            </th>
                            <th>
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {users.nodes.map((user)=>{
                               return <OrganizationUserListItem
                                   updateRole={handleUpdateRole}
                                   leave = {handleLeave}
                                   key={user.userName}
                                   organization={organization} user={user}/>
                            })}
                        </tbody>
                    </table>
                    </div>
                )
            }
            </Col>

        </Row>
    </Container>
}


export default OrganizationUserList;
