import React ,{useState,useEffect} from "react";
import {Container, Row, Badge,Col,Spinner} from "react-bootstrap";
import {If, Then,Else} from "react-if";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import MainActionButton from "../../../components/MainActionButton/MainButton";
import {toast} from "react-toastify";
import {Link} from "react-router-dom"
import useClient from "../../../api/client";
import OrganizationListItem from "./OrganizationListItem";
import listOrganizations from "../../../api/Organization/listOrganizations"
import archiveOrganization from "../../../api/Organization/archiveOrganization";
import Pager from "../../../components/Pager/Pager";
import BasicCard from "../../../components/Card/BasicCard";




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
    let [displayArchiveModal, setDisplayArchiveModal] = useState(false);
    let [targetOrg, setTargetOrg] = useState(null);
    let [sortCriteria, setSortCriteria] = useState([{field:'created', direction:'desc'},{field:'label', direction: 'asc'}]);
    let [sortCriterias, setSortCriterias] = useState({label :'asc',created:'desc'});


    const openArchiveOrganizationModal=(org)=>{
        setTargetOrg(org);
        setDisplayArchiveModal(true);
    }


    const archiveOrg = async ()=>{
        const response = await client.mutate(archiveOrganization(targetOrg.organizationUri));
        if (!response.errors){
            toast(`Archived organization ${targetOrg.name}(${targetOrg.organizationUri})`);
        }else {
            toast(`Could not archive organization ${targetOrg.name}(${targetOrg.organizationUri}), received ${response.errors[0].message}`);
        }
        setDisplayArchiveModal(false);
        setTargetOrg(null);
        fetchItems();
    }

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
            setReady(false);
            setOrganizations({...organizations,page:organizations.page+1})
        }
       //await fetchItems()

    }

    const previousPage=async ()=>{
        if (organizations.hasPrevious){
            setReady(false);
            setOrganizations({...organizations,page:organizations.page-1});
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems()
        }
    },[client, organizations.page])


    return <Container fluid className={"mt-4"}>
        <Row>
            <Col xs={10}>
                <h3> <Icon.House/> My Organizations</h3>
            </Col>
            <Col className={`mb-1 text-right`} xs={2}>
                <Link to={`neworganization`}>
                    <div className={`rounded-pill btn-sm btn btn-info`}>
                        <b>Create Org</b>
                    </div>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={12}>
                <Pager
                    label={`organization(s)`}
                    count={organizations.count}
                    page={organizations.page}
                    pages={organizations.pages}
                    next={nextPage}
                    previous={previousPage}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                />
            </Col>
        </Row>
        <Row>
            <Col className={``} xs={12}>
                <If condition={displayArchiveModal}>
                    <Then>
                        <div  className={`mt-2 mb-2 alert alert-secondary`}>
                            <Row>
                                <Col xs={6}>
                                    Archive Organization <b>{targetOrg&&targetOrg.name}({targetOrg&&targetOrg.organizationUri})</b>
                                </Col>
                                <Col xs={6}>
                                    <div className={`btn-group`}>
                                        <div onClick={archiveOrg} className={`btn btn-sm btn-danger`}>Archive</div>
                                        <div className={`pl-2 btn btn-sm  btn-primary`} onClick={()=>{setDisplayArchiveModal(false); setTargetOrg(null)}}>Cancel</div>
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    Archiving will archive all child resources associated with the organization
                                </Col>
                            </Row>
                        </div>
                    </Then>
                </If>
            </Col>
        </Row>
        <Row  className={`mt-2`}>
            <If condition={!ready}>
                <Then>
                    <Col xs={12}>
                        <Spinner variant="primary" animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Col>
                </Then>
                <Else>
                    <If condition={organizations.count}>
                        <Then>
                            {

                                organizations.nodes.map((org)=>{
                                    return <Col fluid className={`mt-4`} xs={4}>
                                            <OrganizationListItem openArchiveOrganizationModal={openArchiveOrganizationModal} key={org.organizationUri} organization={org}/>
                                    </Col>
                                })
                            }
                        </Then>
                        <Else>
                            <Col xs={12}>
                                <i>No Organization found.</i>
                            </Col>
                        </Else>
                    </If>
                </Else>
            </If>
        </Row>


    </Container>



}



export default OrganizationList;
