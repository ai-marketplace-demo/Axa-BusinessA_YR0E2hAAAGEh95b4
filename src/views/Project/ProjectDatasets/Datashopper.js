import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import {If,Then,Else} from "react-if"
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import addDatasetToProject  from "../../../api/Project/addDatasetToProject";
import listAvailableDatasets from "../../../api/Project/listAvailableDatasets";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

dayjs.extend(relativeTime);

const Styled= styled.div`
height:60vh;
width:100%;
overflow-y:auto;
overflow-x: hidden;
scrollbar-color: lightblue white ;
scrollbar-width: thin;
  

&::-webkit-scrollbar
{
	width: 4px;
	padding-left: 1px;
	background-color: white;
}

&::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	background-color: lightblue;
}

`

const Datashopper= (props)=>{
    const client = useClient();
    const project= props.project;
    const projectUri = project.projectUri;
    let [term, setTerm]= useState('');
    let [datasets, setDatasets] = useState({
        count:0,
        nodes:[],
        page : 1,
        pages:0,
        hasNext : false,
        hasPrevious:false
    });

    const envFormatter=(cell, row)=>{
        return <Link to={`/playground/${row.environment.environmentUri}`}>{row.environment.name}</Link>

    }

    const datasetLinkFormatter=(cell, row)=>{
        return <p>
            <Link to={`/organization/${row.organization.organizationUri}/dashboard`}>{row.organization.name}</Link> /
            <Link to={`/dataset/${row.datasetUri}/overview`}>{row.name}</Link>
        </p>
    }

    const actionFormatter=(cell, row)=>{
        return <div onClick={()=>{linkDataset(row.datasetUri)}} className={`btn btn-primary btn-sm `}>Link</div>
    }

    const columns=[
        {
            dataField: 'label',
            headerStyle: {width: '5ch'},
            formatter:datasetLinkFormatter,
            text: 'Dataset'
        },
        {
            datafield:'environment',
            formatter:envFormatter,
            headerStyle: {width: '5ch'},
            text:'Env'
        },
        {
            dataField: 'userRoleForDataset',
            headerStyle: {width: '5ch'},
            text: 'Permission'

        },
        {
            dataField: 'projectPermission',
            headerStyle: {width: '5ch'},
            text: 'Access Type'
        },

        {
            text:'Action',
            headerStyle: {width: '5ch'},
            formatter:actionFormatter,
            dataField: 'datasetUri',
        },
    ]


    const linkDataset=async (datasetUri)=>{
        const res = await client.mutate(addDatasetToProject({
            projectUri,
            datasetUri
        }));
        if (!res.errors){
            await fetchItems()
        }else{
            toast.warning(`Could not ling dataset to project, received ${res.errors[0].message}`)
        }
    }

    const nextPage=()=>{
        if(datasets.hasNext){
            setDatasets({...datasets,page:datasets.page+1})
        }
    }
    const prevPage=()=>{
        if(datasets.hasPrevious){
            setDatasets({...datasets,page:datasets.page-1})
        }
    }
    const handleKeyDown = async (e)=>{
        if (e.key === 'Enter') {
            fetchItems()
        }
    }

    const handleInputChange=(e)=>{
        setTerm(e.target.value);
    };

    const fetchItems=async ()=>{
        const response= await  client
            .query(listAvailableDatasets({
                projectUri: props.project.projectUri,
                filter:{
                    page: datasets.page,
                    pageSize:10,
                    term : term
                }

            }));
        if (!response.errors){
            setDatasets(response.data.listAvailableDatasets);
        }else {
            toast.error(`Could not retrieve datasets, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems()
        }

    },[client,datasets.page])

    return <Container>
        <Row className={`mt-2`}>
            <Col xs={1}>
                <Link style={{color :'black'}} to={`/project/${props.project.projectUri}/datasets`}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={8}>
                <h4> Link new datasets to <b className={`text-primary text-capitalize`}>{props.project.label}</b> </h4>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <Row>
                    <Col xs={4}><i>Found {datasets.count} results</i></Col>
                    <Col xs={6}>
                        <Row>
                            <Col className={`text-left pt-1`}  onClick={prevPage} xs={1}>
                                <Icon.ChevronLeft/>
                            </Col>
                            <Col className={`text-center`} xs={4}>
                                <small>Page {datasets.page}/{datasets.pages}</small>
                            </Col>
                            <Col className={`text-left pt-1`} onClick={nextPage} xs={1}>
                                <Icon.ChevronRight/>
                            </Col>
                        </Row>
                    </Col>

                </Row>
            </Col>
            <Col className={`pt-2`} xs={12}>
                <input className={`form-control`} onKeyDown={handleKeyDown} value={term} onChange={handleInputChange} style={{width:"100%"}}/>
            </Col>
        </Row>
        <Styled>
            <Row>
                <Col className={`pt-3`} xs={12}>
                    <BootstrapTable
                        rowStyle={{height:'15px',fontSize:'13px'}}
                        hover
                        condensed
                        bordered={ false }
                        keyField='shareUri'
                        data={ datasets.nodes}
                        columns={ columns }
                    />
                </Col>
            </Row>
        </Styled>

    </Container>
}


export default Datashopper;
