import React, {useState,useEffect} from "react";
import {Row, Col, Container,Button} from "react-bootstrap";
import {toast} from "react-toastify";
import {If,Then,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import FullScreen from "../../components/FullScreen/Fullscreen";
import Editor from '@monaco-editor/react';
import Select from 'react-select'
import {
    BrowserRouter as Router,
    Route,
    Link ,
    Switch,
    useParams,
    useRouteMatch,
    useHistory
} from "react-router-dom";
import Tabs from "../../components/Tabs/Tabs";
import TablePreview from "./TablePreview";
import TableProfilingJobList from "./TableProfilingJobList";
import TableProfilingReport from "./DatasetProfilingReport";
import useClient from "../../api/client";
import getDatasetTable from "../../api/DatasetTable/getDatasetTable";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);




const TableExplorer = (props)=>{
    let history = useHistory();
    let params=useParams();
    let client= useClient();
    console.log(history);

    let { path, url } = useRouteMatch();
    const versions=[{
        value : 'current', label:'current'
    }]

    let [details, setDetails] = useState({})
    let [ready, setReady] = useState(false);

    const fetchTable=async()=>{
        const response =await client
            .query(getDatasetTable(params.tableUri))
        if (!response.errors){
            setDetails({...response.data.getDatasetTable})
            setReady(true)
        }else {
            toast(`Could not retrieve table, received ${response.errors[0].message}`)
        }

    }

    useEffect(()=>{
        if (client){
            fetchTable();
        }
    },[client, ready])
    return <FullScreen>
        <If condition={ready}>
            <Then>
                <Container className={"m-0 p-0"}>
                    <Row className={"border-bottom"}>
                        <Col xs={1}>
                            <Row>
                                <Col className={"tex-center"}>
                                    <Link to={`/dataset/${params.datasetUri}/tables`}> <Icon.ChevronLeft color={"black"}  className="pt-3 pr-3" size={40}/></Link>
                                </Col>
                            </Row>

                        </Col>

                        <Col xs={4}>
                            <Row>
                                <Col className="pt-3" xs={2}>
                                    <Icon.Table size={32}/>
                                </Col>
                                <Col xs={10}>
                                    <Row>
                                        <h4>Table <b className={`text-primary`}>{details.GlueTableName}</b></h4>
                                    </Row>
                                    <Row>
                                        <p>Created by <a href={"#"}>{details.owner} </a> {dayjs(details.created).fromNow()}</p>
                                    </Row>

                                </Col>
                            </Row>
                        </Col>
                        <Col xs={4}/>
                    </Row>
                    <Row className={`mt-5`}>
                        <Col xs={2} className={`border-right`}>
                            <Row>
                                <Col xs={12}>
                                    <Link style={{outline:'none',color:'black'}} to={{
                                        pathname:`/table/${params.datasetUri}/${params.tableUri}`
                                    }}>Info</Link>
                                </Col>
                                <Col xs={12}>
                                    <Link   style={{}} to={{pathname:`/table/${params.datasetUri}/${params.tableUri}/profilingjobs`}}>
                                        Profiling Jobs
                                    </Link>
                                </Col>
                                <Col xs={12}>
                                    <Link style={{color:'black'}} to={{
                                        pathname:`/table/${params.datasetUri}/${params.tableUri}/preview`
                                    }}>Preview</Link>

                                </Col>

                                <Col xs={12}>
                                    <Link style={{color:'black'}} to={{
                                        pathname:`/table/${params.datasetUri}/${params.tableUri}/columns`
                                    }}>Columns</Link>

                                </Col>
                                <Col xs={12}>Partitions</Col>
                            </Row>
                        </Col>
                        <Col xs={10}>
                            <Switch>
                                <Route path={`/table/${params.datasetUri}/${params.tableUri}/preview`}>
                                    <TablePreview table={details}/>
                                </Route>
                                <Route path={`/table/${params.datasetUri}/${params.tableUri}/columns`}>
                                    <h4>Columns</h4>
                                </Route>
                                <Route path={`/table/${params.datasetUri}/${params.tableUri}/profilingjobs`}>
                                    <TableProfilingJobList table={details}/>
                                </Route>
                                <Route path={`/table/${params.datasetUri}/${params.tableUri}/report/:jobUri`}>
                                    <TableProfilingReport table={details}/>
                                </Route>
                                <Route path={`/table/${params.datasetUri}/${params.tableUri}`}>
                                    <h4>Info</h4>
                                </Route>
                            </Switch>

                        </Col>
                    </Row>

                </Container>
            </Then>
            <Else>
                <p>Loading ...</p>
            </Else>
        </If>

    </FullScreen>

}



export default TableExplorer;
