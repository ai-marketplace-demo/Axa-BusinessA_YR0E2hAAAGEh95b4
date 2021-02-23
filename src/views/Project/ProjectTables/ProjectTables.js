import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import BootstrapTable from 'react-bootstrap-table-next';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import useClient from '../../../api/client';
import getProjectTables from '../../../api/Project/getProjectTables';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const Styled = styled.div`
height:100vh;
`;

const ProjecTables = (props) => {
    const client = useClient();
    const [term, setTerm] = useState('');
    const [tables, setTables] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });


    const columns = [
        {
            dataField: 'GlueDatabaseName',
            headerStyle: { width: '5ch' },
            text: 'Database'
        },
        {
            dataField: 'GlueTableName',
            headerStyle: { width: '5ch' },
            text: 'Table Name'
        },
        {
            dataField: 'projectPermission',
            headerStyle: { width: '5ch' },
            text: 'Permission'
        }
    ];
    const fetchItems = async () => {
        const response = await client.query(
            getProjectTables({
                filter: {
                    page: tables.page,
                    pageSize: 25
                },
                projectUri: props.project.projectUri
            })
        );
        if (!response.errors) {
            setTables({ ...response.data.listProjectTables });
        } else {
            toast('Could not retrieve tables, received');// ${response.errors[0].message}`)
        }
    };


    const nextPage = () => {
        if (tables.hasNext) {
            setTables({ ...tables, page: tables.page + 1 });
        }
    };

    const prevPage = () => {
        if (tables.hasPrevious) {
            setTables({ ...tables, page: tables.page - 1 });
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client]);

    return (
        <Styled>
            <Container>
                <Row>
                    <Col xs={12}><h4><Icon.Table /> Project tables</h4></Col>
                </Row>
                <Row className={'mt-4'}>
                    <Col xs={4}><i>Found {tables.count} table(s)</i></Col>
                    <Col xs={8}>
                        <Row>
                            <Col className={'text-right mt-2'} xs={2}><Icon.ChevronLeft /></Col>
                            <Col className={'text-center'} xs={5}><i>Page {tables.page} /{tables.pages}</i></Col>
                            <Col className={'text-left mt-2'} xs={2}><Icon.ChevronRight /></Col>
                        </Row>
                    </Col>
                    <Col className={'pt-2'} xs={12}>
                        <input className={'form-control'} value={term} onChange={(e) => { setTerm(e.target.value); }} />
                    </Col>
                </Row>
                <Row>

                    <Col className={'mt-4'} xs={12}>
                        <BootstrapTable
                            rowStyle={{ height: '15px', fontSize: '13px' }}
                            hover
                            condensed
                            bordered={false}
                            keyField="tableUri"
                            data={tables.count && tables.nodes || []}
                            columns={columns}
                        />
                    </Col>
                </Row>
            </Container>
        </Styled>
    );
};


export default ProjecTables;
