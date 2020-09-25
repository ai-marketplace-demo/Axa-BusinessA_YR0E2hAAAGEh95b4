import React ,{useState,useEffect} from "react";
import {Container, Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import MainActionButton from "../../../components/MainActionButton/MainButton";
import {toast} from "react-toastify";
import {Link} from "react-router-dom"
import useClient from "../../../api/client";
import OrganizationListItem from "./OrganizationListItem";
import listOrganizations from "../../../api/Organization/listOrganizations"


const Styled=styled.div`
height:100vh;
`

const OrganizationList = (props)=>{
    let client = useClient();
    let [organizations, setOrganizations]=useState({
        count:0,
        nodes:[],
        page:1,
        hasNext:false,
        hasPrevious:false,
        pageSize:5,
        pages:0
    });
    let [ready, setReady] = useState(false);
    let [search, setSearch] = useState('');
    let [sortCriteria, setSortCriteria] = useState([{field:'created', direction:'desc'},{field:'label', direction: 'asc'}]);
    let [sortCriterias, setSortCriterias] = useState({label :'asc',created:'desc'});



    const fetchItems=async ()=>{
        const query =listOrganizations({
            filter:{
                page : organizations.page,
                pageSize: organizations.pageSize,
                term:search,
                sort:Object.keys(sortCriterias).map((k)=>{ return {field:k, direction:sortCriterias[k]}}),
                roles:['Admin','Owner','Member']
            }

        })
        const response = await client.query(query);
        if (!response.errors){
            if (!ready){setReady(true)};
            setOrganizations({...response.data.listOrganizations})
        }else {
            toast.error(`Failed to refresh organizations, received ${response.errors[0].message}`)
        }
    }
    const handleChangeSort =async (field)=>{
        setSortCriterias({...sortCriterias,[field]:sortCriterias[field]=='asc'?'desc':'asc'});
        await fetchItems()
    }

    const __handleKeyDown = async (e)=>{
        if (e.key === 'Enter') {
            const response = await client
                .query(
                    listOrganizations({
                        term:search,
                        sort:Object.keys(sortCriterias).map((k)=>{ return {field:k, direction:sortCriterias[k]}}),
                        roles:['Admin','Owner','Member']})
                );
            if (!response.errors){
                setOrganizations(response.data.listOrganizations)
            }else {
                toast.error(`Failed to refresh organizations, received ${response.errors[0].message}`)
            }
        }

    }

    const handleKeyDown = async (e)=>{
        if (e.key === 'Enter') {
            await fetchItems()
        }
    }

    const handleChange = (event)=>{
        setSearch(event.target.value)
    }

    const nextPage=async ()=>{
        if (organizations.hasNext){
            setOrganizations({...organizations,page:organizations.page+1})
        }
       //await fetchItems()

    }

    const previousPage=async ()=>{
        if (organizations.hasPrevious){
            setOrganizations({...organizations,page:organizations.page-1});
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems()
        }
    },[client, organizations.page])


    return <Styled>
        <Container>
        <Row>
            <Col xs={10}>
                <h3> <Icon.House/> My Organizations</h3>
            </Col>
            <Col className={`mb-1 text-right`} xs={2}>
                    <MainActionButton>
                        <Link to={"/neworganization"}>
                            Create
                        </Link>
                    </MainActionButton>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={12}>
                <Row>
                    <Col xs={2}><i>Found <b>{organizations.count}</b> results</i></Col>
                    <Col xs={4}>
                        <Row>
                            <Col className={`text-right pt-2`}><Icon.ChevronLeft onClick={previousPage}/></Col>
                            <Col className={`text-center`}>Page {organizations.page}/{organizations.pages}</Col>
                            <Col className={`text-left pt-2`}><Icon.ChevronRight onClick={nextPage}/></Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col xs={12} className={`mt-1`}>
                <input className={`form-control`} onKeyDown={handleKeyDown} onChange={handleChange} value={search} style={{width:"100%"}} placeholder={"search"}/>
            </Col>
        </Row>
        {
            (!ready)?(
                <Spinner variant="primary" animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            ):(
                <div>

                    <Row className={"mt-3"}>
                        {
                            (!organizations.count)?(
                                <Col xs={12}>
                                    <i>No Organization found.</i>
                                </Col>

                            ):(
                                organizations.nodes.map((org)=>{
                                    return <OrganizationListItem key={org.organizationUri} organization={org}/>
                                })
                            )
                        }

                    </Row>
                </div>

            )
        }

    </Container>
    </Styled>


}



export default OrganizationList;
