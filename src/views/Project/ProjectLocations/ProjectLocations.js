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
import getProjectLocations from '../../../api/Project/getProjectLocations';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const Styled = styled.div`
height:100vh;
`;

const ProjectLocations = (props) => {
    const client = useClient();
    const [term, setTerm] = useState('');
    const [locations, setLocations] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });


    const columns = [
        {
            dataField: 'locationUri',
            headerStyle: { width: '5ch' },
            text: 'locationUri'
        },
        {
            dataField: 'S3BucketName',
            headerStyle: { width: '5ch' },
            text: 'Bucket'
        },
        {
            dataField: 'S3Prefix',
            headerStyle: { width: '5ch' },
            text: 'Path'
        },
        {
            dataField: 'environmentEndPoint',
            headerStyle: { width: '5ch' },
            text: 'Access Point'
        },
        {
            dataField: 'projectPermission',
            headerStyle: { width: '5ch' },
            text: 'Permission'
        }
    ];
    const fetchItems = async () => {
        const response = await client.query(
            getProjectLocations({
                filter: {
                    page: locations.page,
                    pageSize: 25
                },
                projectUri: props.project.projectUri
            })
        );
        if (!response.errors) {
            setLocations({ ...response.data.listProjectStorageLocations });
        } else {
            toast('Could not retrieve locations, received');// ${response.errors[0].message}`)
        }
    };


    const nextPage = () => {
        if (locations.hasNext) {
            setLocations({ ...locations, page: locations.page + 1 });
        }
    };

    const prevPage = () => {
        if (locations.hasPrevious) {
            setLocations({ ...locations, page: locations.page - 1 });
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
                    <Col xs={12}><h4><Icon.Folder /> Project locations</h4></Col>
                </Row>
                <Row className={'mt-4'}>
                    <Col xs={4}><i>Found {locations.count} locations(s)</i></Col>
                    <Col xs={8}>
                        <Row>
                            <Col className={'text-right mt-2'} xs={2}><Icon.ChevronLeft /></Col>
                            <Col className={'text-center'} xs={5}><i>Page {locations.page} /{locations.pages}</i></Col>
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
                            keyField="locationUri"
                            data={locations.count && locations.nodes || []}
                            columns={columns}
                        />
                    </Col>
                </Row>
            </Container>
        </Styled>
    );
};


export default ProjectLocations;
