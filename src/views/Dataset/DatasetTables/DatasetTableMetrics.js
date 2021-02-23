import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import { toast } from 'react-toastify';
import getDatasetTableProfilingRun from '../../../api/DatasetTable/getDatasetTableProfilingRun';
import startDatasetProfilingRun from '../../../api/DatasetTable/startProfilingRun';
import useClient from '../../../api/client';
import MetricsComponent from './DatasetTableMetrics/MetricsComponent';


const DatasetTableMetrics = (props) => {
    const client = useClient();
    const [ready, setReady] = useState(false);
    const [metrics, setMetrics] = useState(undefined);
    const fetchData = async () => {
        setReady(false);
        const response = await client.query(getDatasetTableProfilingRun(props.table.tableUri));
        if (!response.errors) {
            if (response.data.getDatasetTableProfilingRun && response.data.getDatasetTableProfilingRun.results) setMetrics(JSON.parse(response.data.getDatasetTableProfilingRun.results));
        } else {
            toast.info(`Could not retrieve metrics, received ${response.errors[0].message}`);
        }
        setReady(true);
    };

    const startProfilingRun = async () => {
        const response = await client.mutate(startDatasetProfilingRun({
            input:
                { datasetUri: props.table.dataset.datasetUri, tableUri: props.table.tableUri }
        }));
        if (!response.errors) {
            toast.success(`Table ${props.table.GlueTableName} profiling started`);
        } else {
            toast.info(`Could not start profiling run, received ${response.errors[0].message}`);
        }
    };

    useEffect(() => {
        if (client) {
            fetchData();
        }
    }, [client, props.table]);
    return (
        <Row>
            <Col className={'mt-2 ml-3'} xs={12}>
                <If condition={!ready}>
                    <Then>
                        <Row className={'mt-3'}>
                            <Col className={'mt-2'} xs={12}>
                                <Spinner variant={'info'} animation={'grow'} />
                            </Col>
                        </Row>
                    </Then>
                    <Else>
                        {!metrics && (<Row><Col>Metrics not available. </Col></Row>)}
                        {(metrics && metrics.columns) && (
                            <Row>
                                <Row className="mb-2">
                                    <Col xs={9} className="mt-2"><h5>Rows count : {metrics.table_nb_rows || 'N/A'}</h5></Col>
                                    <Col xs={3}>
                                        <div className={'btn btn-sm btn-info rounded-pill'} onClick={() => { startProfilingRun(); }}>Run Profiling</div>
                                    </Col>
                                </Row>
                                {metrics.columns.map((column) => (
                                    <Row className="mb-2" key={column.Name}>
                                        <Col xs={12} className={'border'}><MetricsComponent stage={metrics.columns} column={column} reloadData={fetchData} /></Col>
                                    </Row>
                                ))}
                            </Row>
                        )}
                    </Else>
                </If>

            </Col>
        </Row>
    );
};


export default DatasetTableMetrics;
