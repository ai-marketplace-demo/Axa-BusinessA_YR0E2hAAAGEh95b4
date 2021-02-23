import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    If, Then, Else, Switch, Case, Default
} from 'react-if';
import styled from 'styled-components';
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';
import {
    Container, Row, Col, Modal, Button
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import listDatasetsPublishedInEnvironment from '../../api/Environment/listDatasetsPublishedInEnvironment';
import useClient from '../../api/client';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import listDatasetsCreatedInEnvironment from '../../api/Environment/listDatasetsCreatedInEnvironment';

dayjs.extend(relativeTime);


const TableOverflow = styled.div`
height:60vh;
width:100%;
overflow-y:auto;
overflow-x: hidden;
scrollbar-color: lightblue white ;
scrollbar-width: thin;
padding-bottom: 22em;

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

`;

const EnvironmentDatasets = (props) => {
    const env = props.environment;
    const client = useClient();

    const datasetLinkFormatter = (cell, row) => (
        <p>
            <Link target={'_blank'} to={`/dataset/${row.datasetUri}/overview`}>{row.label}</Link>
        </p>
    );


    const dateFormatter = (cell, row) => (
        <div>
            {dayjs(row.created).fromNow()}
        </div>
    );


    const columns = [
        {
            dataField: 'datasetName',
            // headerStyle: {width: '12ch'},
            text: 'Dataset',
            formatter: datasetLinkFormatter
        },

        {
            dataField: 'GlueDatabaseName',
            // headerStyle: {width: '12ch'},
            text: 'Database'

        },
        {
            dataField: 'S3BucketName',
            text: 'S3 Bucket'
        },
        {
            dataField: 'created',
            text: 'Created',
            formatter: dateFormatter
        },

    ];


    const [search, setSearch] = useState();
    const [items, setItems] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });
    const handleKeyDown = async () => {
        await listItems();
    };


    const listItems = async () => {
        const response = await client.query(listDatasetsCreatedInEnvironment({
            environmentUri: env.environmentUri,
            filter: {
                page: items.page,
                pageSize: 25,
                term: search
            }
        }));
        if (!response.errors) {
            setItems(response.data.listDatasetsCreatedInEnvironment);
        } else {
            toast(`Could not retrieve Published datasets, received ${response.errors[0].message}`);
        }
    };
    useEffect(() => {
        if (client) {
            listItems();
        }
    }, [client, items.page]);


    return (
        <Container className={'mt-1'}>
            <Row>
                <Col xs={12}>
                    <h4><Icon.FolderSymlink />  Datasets Published in Environment <b className={'text-primary'}>{env.name} ({env.AwsAccountId}/{env.region})</b></h4>
                </Col>
            </Row>
            <Row className={'mt-2'}>
                <Col xs={4}>
                    <i>Found {items.count} data items</i>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col className={' pt-2 text-right'} xs={1}><Icon.ChevronLeft size={16} /></Col>
                        <Col className={'text-center'} xs={3}>Page {items.page}/{items.pages}</Col>
                        <Col className={' pt-2  text-left'} xs={1}><Icon.ChevronRight size={16} /></Col>
                    </Row>
                </Col>
                <Col className={' pt-2'} xs={12}>
                    <input
                        onKeyDown={handleKeyDown}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); }}
                        style={{ width: '100%' }}
                        className={'form-control'}
                    />
                </Col>
            </Row>
            <Row className={'mt-3'}>
                <Col xs={12}>
                    <If condition={items.count}>
                        <Then>
                            <TableOverflow>
                                <BootstrapTable
                                    rowStyle={{ height: '15px', fontSize: '13px' }}
                                    hover
                                    condensed
                                    bordered={false}
                                    keyField="shareUri"
                                    data={items.nodes}
                                    columns={columns}
                                />

                            </TableOverflow>


                        </Then>
                        <Else>
                            <p>No items found.</p>
                        </Else>
                    </If>
                </Col>
            </Row>

        </Container>
    );
};


export default EnvironmentDatasets;
