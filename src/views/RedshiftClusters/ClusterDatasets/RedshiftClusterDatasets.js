import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import BootstrapTable from 'react-bootstrap-table-next';
import MainActionButton from "../../../components/MainActionButton/MainButton";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import listClusterDatasets from "../../../api/RedshiftCluster/listClusterDatasets";
import removeDatasetFromCluster  from "../../../api/RedshiftCluster/removeDatasetFromCluster";
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

const RoundedButton=styled.div`
border-radius : 23px;
height : 4ch;
padding : 2px;
padding-top : 4px;
margin-top: 3px;
color : white;
width:13ch;
text-align: center;
background-color: lightcoral;
__border : 1px solid lightgray;
transition: transform 0.2s ease-in-out;
&:hover{
  transform: translateY(-3px);
  box-shadow: darkgray 2px 0px 2px;
  }
`

const RedshiftClusterDatasets= (props)=>{
    console.log("props = ", props);
    const client=useClient();
    let params=useParams();
    const cluster= props.cluster;
    const clusterUri = cluster.clusterUri;

    let [datasets, setDatasets]=useState({
        count:0,
        nodes:[],
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious : false
    });
    let [term, setTerm] = useState(null);



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
        return <div onClick={()=>{unlinkDataset(row.datasetUri)}} className={`btn btn-secondary btn-sm `}>Unlink</div>
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
            dataField: 'redshiftClusterPermission',
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

    const handleInputChange=(e)=>{
        setTerm(e.target.value);
        setDatasets({...datasets,page:1})
    };


    const handleKeyDown = async (e)=>{
        if (e.key === 'Enter') {
            setDatasets({...datasets,page:1})
            await fetchItems()
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

    const unlinkDataset=async (datasetUri)=>{
        toast(`Trying to unlink dataset ${datasetUri} from project ${clusterUri}`)

        const res = await client.mutate(removeDatasetFromCluster({
            clusterUri,
            datasetUri
        }));
        if (!res.errors){
            toast(`Unlinked dataset ${datasetUri} from project `)
            await fetchItems()
        }else{
            toast.warn(`Could not unlink dataset from project, received ${res.errors[0].message}`)
        }
    }

    const fetchItems=async ()=>{
        const response= await  client
            .query(listClusterDatasets({
                clusterUri:clusterUri,
                filter:{
                    term,
                    page:datasets.page,
                    pageSize:10
                }
            }));
        if (!response.errors){
            setDatasets(response.data.listRedshiftClusterDatasets);
        }else {
            toast.error(`Could not retrieve datasets, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,datasets.page]);


    return <Container>
        <Row className={'mt-4'}>
            <Col xs={8}>
                <h4><Icon.Folder size={32}/> Available Datasets</h4>
            </Col>
            <Col xs={4}>
                <Link to={`/redshiftcluster/${cluster.clusterUri}/addDataset`}>
                    <MainActionButton>Link Dataset</MainActionButton>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <Row>
                    <Col xs={4}><i>Found {datasets.count} results</i></Col>
                    <Col xs={6}>
                        <Row>
                            <Col className={`pt-2 text-right`} onClick={prevPage} xs={1}>
                                <Icon.ChevronLeft/>
                            </Col>
                            <Col className={`text-center`} xs={5}>
                                Page {datasets.page}/{datasets.pages}
                            </Col>
                            <Col className={`pt-2 text-left`}  onClick={nextPage} xs={1}>
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
            <Row className={`mt-4`}>
                <If condition={datasets.count}>
                    <Then>
                        <Col xs={12}>
                            <BootstrapTable
                                rowStyle={{height:'15px',fontSize:'13px'}}
                                hover
                                condensed
                                bordered={ false }
                                keyField='datasetUri'
                                data={ datasets.nodes}
                                columns={ columns }
                            />
                        </Col>
                    </Then>
                    <Else>
                        <Col xs={12}>
                            <i>No datasets added to your cluster. Start linking datasets
                                <Link to={`addDataset`}> Here</Link>, or create a new one <Link to={`/newdataset`}>Here</Link>

                            </i>
                        </Col>
                    </Else>
                </If>
            </Row>
        </Styled>

    </Container>
}


export default RedshiftClusterDatasets;
