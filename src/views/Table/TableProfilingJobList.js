import React, { useState, useEffect } from 'react';
import {
    Row, Col, Container, Button
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    useParams,
    useRouteMatch,
    useHistory
} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Tabs from '../../components/Tabs/Tabs';
import useClient from '../../api/client';
import getDatasetTable from '../../api/DatasetTable/getDatasetTable';
import startProfilingJob from '../../api/DatasetTable/startProfilingJob';
import listDatasetTableProfilingJobs from '../../api/DatasetTable/listDatasetTableProfilingJobs';
import FullScreen from '../../components/FullScreen/Fullscreen';

dayjs.extend(relativeTime);


const TableProfilingJobList = (props) => {
    const client = useClient();
    const params = useParams();
    const [jobs, setJobs] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });
    const startJob = async () => {
        toast(`Starting job for ${props.table.tableUri}`);
        const response = await client.mutate(startProfilingJob(props.table.tableUri));
        if (!response.errors) {
            toast('Started new job');
            fetchItems();
        } else {
            toast('Could not retrieved profiling jobs ');
        }
    };

    const fetchItems = async () => {
        toast(`Fetching for ${props.table.tableUri}`);
        const response = await client.query(listDatasetTableProfilingJobs(props.table.tableUri));
        if (!response.errors) {
            toast(`Retrieved ${response.data.getDatasetTable.profilingJobs.count} jobs`);
            setJobs({ ...response.data.getDatasetTable.profilingJobs });
        } else {
            toast(`Could not retrieved profiling jobs ${response.errors[0].message}`);
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, jobs.page]);
    return (
        <Container>
            <Row>
                <Col xs={8}>
                    <h4>Profiling Job History for {props.table.GlueTableName} {props.table.tableUri}</h4>
                </Col>
                <Col className={'mb-3'} xs={4}>
                    <div onClick={startJob} className={'btn btn-primary '}>Run</div>
                </Col>
            </Row>
            <Row>
                <Col xs={2}>
                    <i>Found {jobs.count} jobs</i>
                </Col>
                <Col xs={4}>
                    <Row>
                        <Col className={'mt-1 text-right'} xs={2}><Icon.ChevronLeft /></Col>
                        <Col className={'text-center'} xs={8}>Page {jobs.page}/{jobs.pages} jobs</Col>
                        <Col className={'mt-1 text-left'} xs={2}><Icon.ChevronRight /></Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={12}>
                    <table className={'table'}>
                        <tr>
                            <th>
                                Jobid
                            </th>
                            <th>
                                Created
                            </th>
                            <th>
                                Status
                            </th>
                            <th>
                                Report
                            </th>
                        </tr>
                        <tbody>
                            <If condition={jobs.count}>
                                <Then>
                                    {
                                        jobs.nodes.map((job) => (
                                            <tr>
                                                <td>{job.jobUri}</td>
                                                <td>{job.created}</td>
                                                <td>{job.status}</td>
                                                <td>
                                                    <If condition={job.status == 'Success'}>
                                                        <Then>
                                                            <Link
                                                                to={{
                                                                    stats: {
                                                                        job
                                                                    },
                                                                    pathname: `/table/${props.table.datasetUri}/${props.table.tableUri}/report/${job.jobUri}`
                                                                }}
                                                            >
                                                                Report
                                                            </Link>
                                                        </Then>
                                                    </If>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </Then>
                                <Else>
                                    <p><i>No profiling job found</i></p>
                                </Else>
                            </If>
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Container>
    );
};


export default TableProfilingJobList;
