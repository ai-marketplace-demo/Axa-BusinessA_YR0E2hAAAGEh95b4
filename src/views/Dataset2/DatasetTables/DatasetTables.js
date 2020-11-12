import React, {useState,useEffect}  from "react";
import {Container, Row, Spinner,Col} from "react-bootstrap";
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
    const [loading, setLoading]= useState(true);
    const [loadingTables, setLoadingTables]  = useState(false);
    const [mode, setMode]= useState("");

    const tabs=["Description","Columns","Preview","Data Quality","Metrics"]

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
    return <Container className={`mt-4`} fluid>
        <Row>
            <Col xs={2}>
                {/**
                <div onClick={()=>{setMode("form")}} className={`btn btn-sm btn-primary rounded-pill`}>
                    Create Table
                </div>
                 **/}
            </Col>
            <Col xs={8}></Col>
            <Col xs={1}>
                <If condition={loadingTables}>
                    <Then>
                        <Spinner variant={`secondary`} animation={`border`} size={`sm`}/>
                    </Then>
                    <Else>
                        <div/>
                    </Else>
                </If>
            </Col>
            <Col xs={1}>
                <div onClick={startSyncTables}className={`btn btn-secondary btn-sm rounded-pill`}>
                    <Icon.ArrowClockwise/>
                </div>
            </Col>
        </Row>

        <Row>
            <Col className={`mt-4`} xs={2}>

                {
                    tables.nodes.map((t,i)=>{
                        return <Row onClick={()=>{setCurrent(i)}}>
                            <Col xs={1}><Icon.Table size={18}/></Col>
                            <Col xs={8}><p>{t.GlueTableName}</p></Col>
                        </Row>
                    })
                }

            </Col>
            <Col xs={10}>
                <Row>
                    <Col xs={12}>
                        <b style={{fontSize:"3ch"}}>{tables.nodes[current]&&tables.nodes[current].GlueTableName}</b>
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
                                <DatasetTableDescription markdown={tables.nodes[current]&&tables.nodes[current].description}/>
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
                    </Switch>
                </Row>
            </Col>
        </Row>
    </Container>
}

export default DatasetTables;
