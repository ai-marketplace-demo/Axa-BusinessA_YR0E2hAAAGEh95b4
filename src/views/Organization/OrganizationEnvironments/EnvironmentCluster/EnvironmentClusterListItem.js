import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import { Link, useParams, useLocation } from 'react-router-dom';
// import OrganizationEnvironmentListItem from "../OrganizationEnvironmentListItem";


const EnvironmentClusterListItem = (props) => {
    const location = useLocation();
    const params = useParams();

    return (
        <Container className={'border-bottom pb-3'}>
            <Row className={'mt-4'}>
                <Col xs={8}>
                    <Row>
                        <Col xs={5}>
                            <h5 className={'text-capitalize'}><Icon.Play size={32} /> {props.cluster.label}</h5>
                        </Col>
                        <Col xs={5}>
                            <h5 className={'text-capitalize'}>{props.cluster.created}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'ml-3'}>
                            <small> {props.cluster.endpoint}</small>
                        </Col>
                    </Row>
                </Col>

                <Col xs={4}>
                    <Row>
                        <div style={{ width: '7rem' }} className={'btn btn-sm border bg-white'}>Unlink</div>
                    </Row>
                    <Row>
                        <div style={{ width: '7rem' }} className={'btn btn-sm border bg-white'}>Manage</div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};


export default EnvironmentClusterListItem;
