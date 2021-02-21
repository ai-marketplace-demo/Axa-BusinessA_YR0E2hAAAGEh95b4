import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import styled from "styled-components";
import {Container, Row, Col, Badge, Spinner, Alert} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {If, Then, Else, Case, Default} from "react-if";
import useClient from "../../../api/client";
import listDatasetQualityRules from "../../../api/DatasetQualityRule/listDatasetQualityRules";
import getDatasetQualityJobRun from "../../../api/DatasetQualityRule/getDatasetQualityJobRun";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Link,Route,Switch} from "react-router-dom";
import NewDatasetQualityRule from "./NewDatasetQualityRule";
import UpdateDatasetQualityRule from "./UpdateDatasetQualityRule";
import deleteDatasetQualityRule from "../../../api/DatasetQualityRule/deleteDatasetqualityRule";
import startDatasetQualityRun from "../../../api/DatasetQualityRule/startDatasetQualityRun";
import RulesBadge from "../../../components/RulesBadge/RulesBadge";
import * as AiIcon from "react-icons/ai";
import * as VscIcon from "react-icons/vsc";
import * as MdIcon from "react-icons/md";
import * as FaIcon from "react-icons/fa"

let Styled= styled.div`
height: 100vh;
`

const DatasetQualityRulesList = (props)=>{
    let client = useClient();

    let [editedRuleUri, setEditedRuleUri] = useState(``);
    const [mode,setMode] = useState("list");
    let [rules, setRules]=useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    });
    let [jobRun, setJobRun]=useState(undefined);

    const getJobRun = async ()=>{
        const response = await client.query(getDatasetQualityJobRun(props.dataset.datasetUri));
        if (!response.errors){
            setJobRun(response.data.getDatasetQualityJobRun)
        }else {
            toast(`Could not retrieve job run status, received ${response.errors[0].message}`);
        }
    };

    const fetchItems= async ()=>{
        const response = await client.query(listDatasetQualityRules({
            datasetUri:props.dataset.datasetUri,
            filter:{
                page: rules.page,
                pageSize: 15
            }}));

        if (!response.errors){
            setRules(response.data.listDatasetQualityRules)
        }else {
            toast(`Could not retrieve rules, received ${response.errors[0].message}`);
        }
    };
    const deleteRule=async (ruleUri)=>{
        const response = await client.mutate(deleteDatasetQualityRule(ruleUri));
        if (!response.errors){
            fetchItems();
            toast(`Deleted rule ${ruleUri}`);
        }else{
            toast(`Could not delete data quality rule, received ${response.errors[0].message}`);
        }
    };
    const startRun=async ()=>{
        const response = await client.mutate(startDatasetQualityRun(props.dataset.datasetUri));
        if (!response.errors){
            fetchItems();
            toast(`Started data quality Glue job`);
        }else{
            toast(`Could not start data quality Glue job, received ${response.errors[0].message}`);
        }
    };

    const columns=[
        {
            dataField: 'label',
            text: 'Name',
            headerStyle: {width: '2ch'},
            formatter : (cell, row)=>{
                return <Link className={'text-info'} onClick={()=>{setEditedRuleUri(row.ruleUri);setMode("edit");}}>
                    {cell}
                </Link>
            }
        },
        {
            dataField: 'description',
            headerStyle: {width: '3ch'},
            text: 'Description'

        },
        {
            dataField: 'query',
            headerStyle: {width: '5ch'},
            text: 'Query'
        },
        {
            dataField: 'status',
            headerStyle: {width: '2ch'},
            text: 'Status',
            formatter : (cell, row)=>{
                return <RulesBadge status={cell}/>
            },
        },
        {
            dataField: 'logs',
            headerStyle: {width: '5ch'},
            text: 'Logs'
        },
        {
            dataField: 'actions',
            headerStyle: {width: '5ch'},
            text: 'Actions',
            formatter: (cell, row) => {
                return <Row><Col xs={1}>
                    <MdIcon.MdModeEdit size={19} className={`text-primary`}onClick={()=>{setEditedRuleUri(row.ruleUri);setMode("edit");}}/>
                </Col>
                    <Col xs={1}>
                        <FaIcon.FaTrash size={16} onClick={()=>{deleteRule(row.ruleUri)}}className={`text-danger`}/>
                    </Col></Row>
            }
        }

    ];

    useEffect(()=>{
        if (client){
            fetchItems();
            getJobRun();
        }
    },[client]);

    if (mode=="form"){
        return <Container className={`mt-2`} fluid>
            <Row>
                <Col xs={12}>
                    <NewDatasetQualityRule dataset={props.dataset} close={()=>{fetchItems();setMode("");}}/>
                </Col>
            </Row>
        </Container>
    }

    if (mode=="edit"){
        return <Container className={`mt-2`} fluid>
            <Row>
                <Col xs={12}>
                    <UpdateDatasetQualityRule dataset={props.dataset} ruleUri={editedRuleUri} close={()=>{fetchItems();setMode("");setEditedRuleUri(undefined)}}/>
                </Col>
            </Row>
        </Container>
    }

    return <Styled>
        <Container>
            <Row>
                <Col xs={8}>
                    {(rules.count > 0 &&
                        <div>
                            {(props.dataset.quality === 'non-compliant' &&
                                <Badge pill variant={`danger`}>
                                    <span className={'mb-2 mr-1 text-uppercase'}><AiIcon.AiOutlineStop/>Non-compliant to quality rules</span>
                                </Badge>
                            )}
                            {(props.dataset.quality === 'compliant' &&
                                <Badge pill variant={`success`}>
                                    <span className={'mb-2 mr-1 text-uppercase'}><AiIcon.AiOutlineCheckCircle/>compliant to quality rules</span>
                                </Badge>
                            )}
                        </div>
                    )}
                </Col>
                <Col xs={2}>
                    <div onClick={()=>{setMode("form")}} className={`btn btn-sm btn-info rounded-pill`}>
                        <AiIcon.AiOutlineFileSearch size={15}/> New Rule
                    </div>
                </Col>
                {(rules.count > 0 &&
                    <Col xs={2}>
                        <div onClick={startRun} className={`btn btn-sm btn-primary rounded-pill`}>
                            <VscIcon.VscRunAll size={15}/>Launch Job
                        </div>
                    </Col>
                )}
            </Row>
            {(jobRun && jobRun.status &&
                <Row className={'mb-3'}>
                    <Col xs={5}>
                        <Badge pill variant={`primary`}>
                                    <span className={'mr-1 text-uppercase'}>
                                        <FaIcon.FaCogs/> Job Run {jobRun.status}
                                    </span>
                        </Badge>
                    </Col>
                </Row>
            )}
            <Row className={'mt-3'}>
                <If condition={rules.count}>
                    <Then>
                        <Col xs={12} className={'mt-2'}>
                            <Row>
                                <Col xs={4}>
                                    Found {rules.count} rules
                                </Col>
                                <Col className={`pt-3 text-right`} xs={1}><Icon.ChevronLeft/></Col>
                                <Col className={`pt-2 text-center`} xs={2}>Page {rules.page}/{rules.pages}</Col>
                                <Col className={`pt-3 text-left`} xs={1}><Icon.ChevronRight/></Col>
                            </Row>
                        </Col>
                        <Col className={`mt-1`} xs={12}>
                            <BootstrapTable
                                rowStyle={{height:'15px',fontSize:'13px'}}
                                hover
                                condensed
                                bordered={ false }
                                keyField='ruleUri'
                                data={ rules.nodes}
                                columns={ columns }
                            />
                        </Col>
                    </Then>
                    <Else>
                        <Col xs={12}>
                            <i>No rules found</i>
                        </Col>
                    </Else>
                </If>
            </Row>
        </Container>
    </Styled>
}


export default DatasetQualityRulesList;
