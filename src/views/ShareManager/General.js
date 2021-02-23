import React, { useState, useEffect } from 'react';
import {
    Container, Table, Spinner, Row, Col, Tabs, Tab, Badge, Dropdown
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ShareStatusBadge from '../../components/ShareStatusBadge/ShareStatusBadge';

const General = (props) => (
    <Container className={'mt-1 pb-2'} fluid>
        <Row className={'mt-2'}>
            <Col xs={12}>
                <Table size="sm">
                    <tbody>
                        <tr scope="row">
                            <td>
                                <b>Dataset</b>
                            </td>
                            <td>
                                <Link className={'text-info'} to={`/dataset/${props.share.dataset.datasetUri}/overview`}>
                                    {props.share.dataset.datasetName}
                                </Link>
                            </td>
                        </tr>
                        <tr scope="row">
                            <td>
                                <b>Role</b>
                            </td>
                            <td>
                                {props.share.userRoleForShareObject}
                            </td>
                        </tr>

                        <tr scope="row">
                            <td>
                                <b>Owner</b>
                            </td>
                            <td>
                                {props.share.dataset.businessOwnerEmail}
                            </td>
                        </tr>
                        <tr scope="row">
                            <td>
                                <b>Status</b>
                            </td>
                            <td>
                                <ShareStatusBadge status={props.share.status} />
                            </td>
                        </tr>
                        <tr scope="row">
                            <td>
                                <b>Created</b>
                            </td>
                            <td>
                                {props.share.created}
                            </td>

                        </tr>
                        <tr scope="row">
                            <td>
                                <b>Group</b>
                            </td>
                            <td>
                                {props.share.principal.SamlGroupName}
                            </td>
                        </tr>
                        <tr scope="row">
                            <td>
                                <b>AWS Account</b>
                            </td>
                            <td>
                                {props.share.principal.AwsAccountId}
                            </td>
                        </tr>
                        <tr scope="row">
                            <td>
                                <b>Region</b>
                            </td>
                            <td>
                                {props.share.principal.region}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
    </Container>
);


export default General;
