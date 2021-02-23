import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Badge, Spinner
} from 'react-bootstrap';
import {
    If, Then, Else, Case, Default, Switch
} from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useClient from '../../../api/client';
import getSqlPipelineRuns from '../../../api/SqlPipeline/getSqlPipelineRuns';
import listSqlPipelineExecutions from '../../../api/SqlPipeline/listSqlPipelineExecutions';
import startDataProcessingPipeline from '../../../api/SqlPipeline/startPipeline';


dayjs.extend(relativeTime);

const SqlPipelineRunList = (props) => {
    const dateFormatter = (cell, row, rowIndex) => {
        if (cell) {
            return <div>{dayjs(cell).fromNow()}</div>;
        }
        return <div></div>;
    };


    const statusRenderer = (cell, row, rowIndex) => (
        <h6><Switch>
            <Case condition={cell == 'SUCCEEDED'}>
                <Badge variant={'success'}>{cell}</Badge>
            </Case>
            <Case condition={cell == 'FAILED'}>
                <Badge variant={'warning'}>{cell}</Badge>
            </Case>
            <Case condition={cell == 'RUNNING'}>
                <div>  <Badge variant={'info'}>{cell}</Badge> <Spinner size={'sm'} animation={'border'} variant={'info'} /></div>
            </Case>
            <Default>
                <Badge variant={'danger'}>{cell}</Badge>
            </Default>
        </Switch>
        </h6>
    );

    const columns = [

        {
            dataField: 'name',
            // headerStyle: {width: '12ch'},
            text: 'name'
        },
        {
            dataField: 'status',
            // headerStyle: {width: '12ch'},
            text: 'status',
            formatter: statusRenderer
        },
        {
            dataField: 'startDate',
            // headerStyle: {width: '12ch'},
            text: 'Started',
            formatter: dateFormatter
        },
        {
            dataField: 'stopDate',
            // headerStyle: {width: '12ch'},
            text: 'Completed',
            formatter: dateFormatter
        }
    ];

    const client = useClient();
    const { sqlPipeline } = props;
    const [runs, setRuns] = useState(null);
    const [count, setCount] = useState(-1);
    const [ready, setReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchItems = async () => {
        setReady(false);
        const response = await client.query(listSqlPipelineExecutions({
            sqlPipelineUri: sqlPipeline.sqlPipelineUri,
            stage: 'prod'
        }));
        console.log('SqlPipelineRunList.fetchItems', response);
        if (!response.errors) {
            setRuns(response.data.listSqlPipelineExecutions.nodes);
            setCount(response.data.listSqlPipelineExecutions.count);
        } else {
            toast.warn(`Could not retrieved job runs, received ${response.errors[0].message}`);
        }
        setReady(true);
    };

    const runPipeline = async () => {
        setIsSubmitting(true);
        const response = await client.mutate(startDataProcessingPipeline(sqlPipeline.sqlPipelineUri));
        if (!response.errors) {
            toast('Started pipeline');
        } else {
            toast(`Could not start pipeline, received ${response.errors[0].message}`);
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client]);

    /**
    if (!ready){
        return <Container>
            <Row className={`mt-2 ml-2`}>
                <Col xs={12}>
                    <Spinner size={`sm`} variant={`info`} animation={`border`}/>
                </Col>
            </Row>
        </Container>
    }
     * */

    return (
        <Container>
            <Row>
                <Col xs={6} />
                <Col className={'mt-3 mb-3'} xs={2}>
                    <If condition={!ready}>
                        <Then>
                            <Spinner variant={'info'} animation={'border'} size={'sm'} />
                        </Then>
                    </If>
                </Col>

                <Col className={'mt-3 mb-3'} xs={2}>
                    <div disabled={isSubmitting} onClick={runPipeline} className={'btn btn-info btn-sm rounded'}><Icon.Play /> Run Pipeline</div>
                </Col>
                <Col className={'mt-3 mb-3'} xs={1}>
                    <div onClick={fetchItems} className={'btn btn-secondary rounded-pill'}>
                        <Icon.ArrowClockwise />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <p> Found {count} execution(s)</p>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <BootstrapTable
                        rowStyle={{ height: '15px', fontSize: '13px' }}
                        hover
                        condensed
                        bordered={false}
                        keyField="shareUri"
                        data={runs || []}
                        columns={columns}
                    />

                </Col>
            </Row>
        </Container>
    );
};


export default SqlPipelineRunList;
