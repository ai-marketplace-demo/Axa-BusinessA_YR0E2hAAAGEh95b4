import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import MainButtonAction from "../../../components/MainActionButton/MainButton";
import {Link,useParams,useLocation} from "react-router-dom"
import OrganizationEnvironmentListItem from "./OrganizationEnvironmentListItem3";
import useClient from "../../../api/client";
import listOrganizationEnvironments from "../../../api/Environment/listOrganizationEnvironments";
import {toast} from "react-toastify";
import listOrganizations from "../../../api/Organization/listOrganizations";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`



const OrganizationEnvironmentList=(props)=>{

    let params= useParams();
    let location = useLocation();
    let client = useClient();
    let [ready, setReady] = useState(false);
    let [envs,setEnvironments] = useState({
        count:0,
        nodes:[],
        page:1,
        hasNext:false,
        hasPrevious:false,
        pageSize:3,
        pages:0
    });
    let [search, setSearch] = useState('');
    let [sortCriterias, setSortCriterias]=useState({label:'asc',created:'desc'});
    let organization = location.state;
    let canLink= false;
    if (organization.userRoleInOrganization=='Admin' | organization.userRoleInOrganization=='Owner'){
        canLink=true;
    }

    const fetchItems = async ()=>{
        console.log("fetchItems search = ", search)
        const response = await client
            .query(listOrganizationEnvironments({
                organizationUri:organization.organizationUri,
                filter:{
                    term :search,
                    page:  envs.page,
                    pageSize: envs.pageSize,
                    sort: Object.keys(sortCriterias).map((k)=>{ return {field:k, direction: sortCriterias[k]}})
                }
            }));
        console.log("response = ", response);
        if (!response.errors){
            setEnvironments(response.data.getOrganization.environments)
        }else {
            toast.error(`Failed to refresh environments, received ${response.errors[0].message}`)
        }
    }

    const handleInputChange = async (event)=>{
        setSearch(event.target.value);

    }

    const handleChangeSort =async (field)=>{
        setSortCriterias({...sortCriterias,[field]:sortCriterias[field]=='asc'?'desc':'asc'});
    }

    const handleKeyDown = async (e)=>{
        if (e.key === 'Enter') {
            await fetchItems();
        }

    }

    useEffect(()=>{
        if (client){
            client
                .query(listOrganizationEnvironments({
                    organizationUri:organization.organizationUri,
                    filter:{
                        term : search,
                        page : envs.page,
                        pageSize:envs.pageSize,
                        sort: Object.keys(sortCriterias).map((k)=>{ return {field:k, direction: sortCriterias[k]}})
                    }
                }))
                .then((res)=>{
                    console.log("environments = ",res.data.getOrganization.environments);
                    setEnvironments(res.data.getOrganization.environments);
                    setReady(true);
                })

        }
    },[client,envs.page]);

    const nextPage =()=>{
        if(envs.hasNext){
            setEnvironments({...envs, page:envs.page+1})
        }
    }

    const prevPage=()=>{
        if(envs.hasPrevious){
            setEnvironments({...envs, page:envs.page-1})
        }
    }
    return <Container>
        <Row>
            <Col xs={1}>
                <Row>
                    <Col className={"text-left "} xs={12}>
                        <Link style={{color:"black"}} to={`/organizations`}>
                            <Icon.ChevronLeft className={`pt-2`} size={36}/></Link>
                    </Col>
                </Row>
            </Col>
            <Col xs={10}>
                <h3>   <Icon.Cloud size={32}/> Environments in Organization <b className={"text-primary"}>{location.state.label.toUpperCase()}</b></h3>
            </Col>

        </Row>
        <Row className={`mt-4`}>

            <Col xs={3}><i>Found <b>{envs.count}</b> results</i></Col>
            <Col xs={4}>
                <Row>
                    <Col className={`text-right pt-2`}><Icon.ChevronLeft onClick={prevPage}/></Col>
                    <Col className={`text-center`}>Page {envs.page}/{envs.pages}</Col>
                    <Col className={`text-left pt-2`}><Icon.ChevronRight onClick={nextPage}/></Col>
                </Row>
            </Col>
            <Col xs={3}/>
            <Col className={`mb-1 mr-1 text-right`} xs={2}>
                {
                    (canLink)?(
                            <MainButtonAction>
                            <Link

                                to={{
                                    state: location.state,
                                    pathname:`/newenvironment/${params.uri}`
                                }}><Icon.Plus size={18}/> Link</Link>
                            </MainButtonAction>
                    ):(
                        <div></div>
                    )
                }
            </Col>
            <Col xs={12}>
                <input className={`form-control`} onKeyDown={handleKeyDown} onChange={handleInputChange} value={search} placeholder={'search environments'} style={{width:"100%"}}/>
            </Col>
        </Row>

        <Row className={"mt-2"}>
            <Col xs={12}>
                {
                    (!ready)?(
                        <Spinner variant="primary" animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    ):(

                        (envs.count)?(
                            <>

                            <table className={"mt-4 table table-sm"}>
                                <thead>
                                    <tr>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            #AWS
                                        </th>
                                        <th>
                                            Linked
                                        </th>
                                        <th>
                                            Type
                                        </th>
                                        <th>
                                            Validated
                                        </th>
                                        <th>
                                            Your Role On This Environment
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    envs.nodes.map((env)=>{
                                        return <OrganizationEnvironmentListItem
                                            key={env.environmentUri}
                                            environment={env}
                                            organization={location.state}
                                        />
                                    })
                                }
                                </tbody>
                            </table>
                            </>
                        ):(
                        <p><i>No Environments found in this organization</i></p>

                        )
                    )
                }
            </Col>

        </Row>
    </Container>
}


export default OrganizationEnvironmentList;
