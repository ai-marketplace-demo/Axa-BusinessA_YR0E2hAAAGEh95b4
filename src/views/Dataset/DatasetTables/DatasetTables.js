import React, {useState,useEffect}  from "react";
import {Container, Row, Spinner,Col,Badge} from "react-bootstrap";
import {Link, Route} from "react-router-dom";
import {If, Then, Else,Switch,Case,Default} from "react-if";
import * as Icon from "react-bootstrap-icons";
import ReactMarkdown from 'react-markdown';

import DatasetTableColumns from "./DatasetTableColumns";
import DatasetTableDescription from "./DatasetTableDescription";
import DatasetTablePreview from "./DatasetTablePreview";
import DatasetTableUploadForm from "./DatasetTableUploadForm";
import listDatasetTables from "../../../api/Dataset/listDatasetTables";
import syncTables from "../../../api/Dataset/syncTables";
import useClient from "../../../api/client";
import {toast} from "react-toastify";
import DatasetTableMetrics from "./DatasetTableMetrics";
import DatasetTableProfilingRuns from "./DatasetTableProfilingRuns";
import DatasetQualityRulesList from "../DatasetQualityRules/DatasetQualityRulesList";
import NewDatasetQualityRule from "../DatasetQualityRules/NewDatasetQualityRule";


const DescriptionTab =(props)=>{
    return <Row>
        <Col xs={12}>
            <ReactMarkdown children={props.markdown} />
        </Col>
    </Row>
}




const DatasetTables=(props)=>{

    const [current,setCurrent]= useState(0);
    const [tab, setTab] = useState(0);
    const [displayTableList, setDisplayTableList] = useState(true);
    const [loading, setLoading]= useState(true);
    const [loadingTables, setLoadingTables]  = useState(false);

    const [mode, setMode]= useState("");

    const tabs=["Description","Columns","Preview","Metrics", "Profiling Runs"];

    const client = useClient();
    const [tables, setTables] = useState({
        count :0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious : false,
        nodes:[]
    })

    const startSyncTables=async ()=>{
        setLoadingTables(true);
        const response = await client.mutate(syncTables(props.dataset.datasetUri));
        if (!response.errors){
            setTables(response.data.syncTables)
        }else{
            toast.info(`Could not retrieve tables, received ${response.errors[0].message}`)
        }
        setLoadingTables(false);
    }

    const fetchTables=async ()=>{
        setLoading(true);
        const response=await client.query(listDatasetTables({datasetUri:props.dataset.datasetUri}));
        if (!response.errors){
            setTables(response.data.getDataset.tables)
        }else {
            toast.info(`Could not retrieve tables, received ${response.errors[0].message}`)
        }
        setLoading(false);
    }

    useEffect(()=>{
        if (client){
            fetchTables();
        }
    },[client, current]);



    if (mode=="form"){
        return <Container className={`mt-4`} fluid>
            <Row>
                <Col xs={12}>
                    <DatasetTableUploadForm close={()=>{setMode("")}}/>
                </Col>
            </Row>
        </Container>
    }
    return <Container
        style={{
            height:'auto !important'
        }}
        className={`mt-1`} fluid>
        <If condition={loading||loadingTables}>
            <Then>
                <Col className={`mt-1 mb-1`} xs={2}>
                    <Spinner variant={`info`} animation={`border`} size={`sm`}/>
                </Col>
            </Then>
        </If>
        <If condition={tables && tables.nodes && tables.nodes.length > 0}>
            <Then>
                <Row>
                    <If condition={displayTableList}>
                        <Then>
                            <Col xs={3} style={{minHeight:'100vh',height:'auto !important',backgroundColor:'',zIndex:'555',borderRight:'1px solid lightgrey'}}>
                                <Row>
                                    <Col xs={4}>
                                        <div onClick={startSyncTables}className={`btn btn-info btn-sm rounded-pill`}>
                                            <Icon.ArrowClockwise/>
                                        </div>
                                    </Col>
                                    <Col xs={6}/>
                                    <Col className={`pt-1`} xs={1}>
                                        <Icon.ChevronLeft onClick={()=>{setDisplayTableList(false)}}/>
                                    </Col>

                                    <Col className={`mt-1`} xs={12}>

                                        {
                                            tables.nodes.map((t,i)=>{
                                                return <Row onClick={()=>{setCurrent(i)}}>
                                                    {/**<Col xs={1}><Icon.Table size={18}/></Col>**/}
                                                    <Col xs={6}><p>{t.GlueTableName}</p></Col>
                                                    <Col xs={2}>

                                                    </Col>
                                                </Row>
                                            })
                                        }
                                    </Col>

                                </Row>
                            </Col>
                        </Then>
                        <Else>
                            <Col xs={1} style={{width:'22%',minHeight:'100vh',height:'auto !important',backgroundColor:'',zIndex:'555',borderRight:'1px solid lightgrey'}}>
                                <Icon.ChevronRight onClick={()=>{setDisplayTableList(true)}}/>
                            </Col>
                        </Else>
                    </If>
                    <Col style={{   }} xs={displayTableList?9:11}>
                        <Row>
                            <Col xs={8}>
                                <b style={{fontSize:"3ch"}}>
                                    {tables.nodes[current]&&tables.nodes[current].GlueDatabaseName}.

                                </b>
                                <b className={`text-info`} style={{fontSize:"3ch"}}>{tables.nodes[current]&&tables.nodes[current].GlueTableName}</b>
                                {/**<i>{tables.nodes[current]&&tables.nodes[current].tableUri||""}</i>**/}
                            </Col>

                        </Row>
                        <div className={`border-bottom`} style={{display:"flex"}}>
                            {
                                tabs.map((t,i)=>{
                                    return <div style={{marginRight:"5ch"}}>
                                        <If condition={tab==i}>
                                            <Then>
                                                <div className={`border-bottom border-primary text-primary`}> {t}</div>
                                            </Then>
                                            <Else>
                                                <div onClick={()=>{setTab(i)}}  className={`text-dark`}> {t}</div>
                                            </Else>
                                        </If>
                                    </div>
                                })
                            }

                        </div>
                        <Row className={`mt-4`}>
                            <Switch>
                                <Case condition={tab==0}>
                                    <Col xs={12}>
                                        <DatasetTableDescription
                                            client={client}
                                            dataset={props.dataset}
                                            table={tables.nodes[current]||{}}
                                            markdown={tables.nodes[current]&&tables.nodes[current].description}/>
                                    </Col>
                                </Case>
                                <Case condition={tab==1}>
                                    <Col xs={12}>
                                        <DatasetTableColumns table={tables.nodes[current]}/>
                                    </Col>
                                </Case>
                                <Case condition={tab==2}>
                                    <Col xs={12}>
                                        <DatasetTablePreview table={tables.nodes[current]}/>
                                    </Col>
                                </Case>
                                <Case condition={tab==3}>
                                    <Col xs={12}>
                                        <DatasetTableMetrics table={tables.nodes[current]}/>
                                    </Col>
                                </Case>
                                <Case condition={tab==4}>
                                    <Col xs={12}>
                                        <DatasetTableProfilingRuns table={tables.nodes[current]}/>
                                    </Col>
                                </Case>
                            </Switch>
                        </Row>
                    </Col>
                </Row>
            </Then>
        </If>
        <If condition={!loading && !loadingTables && tables.nodes.length === 0}>
            <Then>
                <span>
                        <i>
                            No tables found for this dataset. Synchronize tables from AWS Glue Catalog
                            <Link className={'primary'} onClick={startSyncTables}> here</Link>
                        </i>
                    </span>
            </Then>
        </If>

        <Row style={{minHeight:'30rem'}}/>
    </Container>
}

export default DatasetTables;
