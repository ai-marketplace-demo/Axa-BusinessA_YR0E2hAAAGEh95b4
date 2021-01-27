import React, {useState,useEffect} from "react";
import {Row, Col, Container, Button, Badge, Spinner} from "react-bootstrap";
import {If, Then,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {toast} from "react-toastify";
import 'handsontable/dist/handsontable.full.css';
import {
    BrowserRouter as Router,
    Route,
    Link ,
    Switch,
    useParams,
    useRouteMatch,
    useHistory
} from "react-router-dom";
import useClient from "../../../api/client";
import startDatasetProfilingRun from "../../../api/DatasetTable/startProfilingRun";
import listDatasetTableProfilingRuns from "../../../api/DatasetTable/listDatasetTableProfilingRuns";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const DatasetTableProfilingRuns = (props)=>{
    let client =  useClient();
    let params=useParams();
    let [ready, setReady] = useState(false)
    let [runs, setRuns] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    });

    const statusColor = (status) => {
        let color = 'primary';
        switch (status) {
            case 'SUCCEEDED':
                color = 'success';
                break;
            case'UNKNOWN':
            case'FAILED':
            case'STOPPED':
                color = 'danger';
                break;
            case 'RUNNING':
                color = 'warning';
                break;
            default:
                color = 'primary';
        }
        return color;
    };
    const startJob = async ()=>{
        const response=await client.mutate(startDatasetProfilingRun({input:
                { datasetUri: props.table.dataset.datasetUri, tableUri: props.table.tableUri}}));
        if (!response.errors){
            toast.success(`Table ${props.table.GlueTableName} profiling started`);
            fetchItems();
        }else {
            toast.info(`Could not start profiling run, received ${response.errors[0].message}`);
        }
    };

    const fetchItems=async ()=>{
        setReady(false);
        const response = await client.query(listDatasetTableProfilingRuns(props.table.tableUri));
        if (!response.errors){
            setRuns({...response.data.listDatasetTableProfilingRuns})
        }else {
            toast(`Could not retrieve profiling job runs ${response.errors[0].message}`)
        }
        setReady(true);
    };

    useEffect(()=>{
        if (client){
            fetchItems();
        }

    },[client,runs.page]);
    return <Container>
        <If condition={!ready}>
            <Then>
                <Row className={`mt-3`}>
                    <Col className={`mt-2`} xs={12}>
                        <Spinner variant={`info`} animation={`grow`} />
                    </Col>
                </Row>
            </Then>
            <Else>
                <Row>
                    <Col xs={9}>
                        <h4>Profiling Job Runs</h4>
                    </Col>
                    <Col className={`mb-3`} xs={3}>
                        <div className={`btn btn-sm btn-info rounded-pill`} onClick={()=>{startJob()}}>Run Profiling</div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}>
                        <i>Found {runs.count} jobs</i>
                    </Col>
                    <Col xs={4}>
                        <Row >
                            <Col className={`mt-1 text-right`} xs={2}><Icon.ChevronLeft/></Col>
                            <Col className={`text-center`} xs={8}>Page {runs.page}/{runs.pages} job runs</Col>
                            <Col className={`mt-1 text-left`} xs={2}><Icon.ChevronRight/></Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={`mt-4`}>
                    <Col xs={12}>
                        <table className={"table"}>
                            <tr>
                                <th>
                                    Glue Job Run Id
                                </th>
                                <th>
                                    Started at
                                </th>
                                <th>
                                    Status
                                </th>
                            </tr>
                            <tbody>
                            <If condition={runs.count}>
                                <Then>
                                    {
                                        runs.nodes.map((run)=>{
                                            return <tr>
                                                <td>{(run.GlueJobRunId || 'N/A').substring(0,25)}</td>
                                                <td>{run.created}</td>
                                                <td><Badge className={'mt-2'} variant={`${statusColor(run.status)} text-uppercase`}
                                                           pill>{run.status}</Badge></td>
                                            </tr>
                                        })
                                    }

                                </Then>
                                <Else>
                                    <p><i>No profiling job run found.</i></p>
                                </Else>
                            </If>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Else>
        </If>
    </Container>
}


export default DatasetTableProfilingRuns;
