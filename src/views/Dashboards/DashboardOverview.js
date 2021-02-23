import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const DashboardOverview = (props) => (
    <Container className={'mt-4'}>
        <Row className={'mt-2'}>
            <Col xs={3}><b>Name</b></Col>
            <Col xs={8}>{props.dashboard.label}</Col>
        </Row>
        <Row className={'mt-2'}>
            <Col xs={3}><b>Description</b></Col>
            <Col xs={8}>{props.dashboard.description}</Col>
        </Row>

        <Row className={'mt-2'}>
            <Col xs={3}><b>Created by</b></Col>
            <Col xs={8}>{props.dashboard.owner}</Col>
        </Row>
        <Row className={'mt-2'}>
            <Col xs={3}><b>Topics</b></Col>
            <Col xs={8}>{props.dashboard.topics}</Col>
        </Row>
        <Row className={'mt-2'}>
            <Col xs={3}><b>Tags</b></Col>
            <Col xs={8}>{props.dashboard.tags}</Col>
        </Row>
        <Row className={'mt-2'}>
            <Col xs={3}><b>Organization</b></Col>
            <Col xs={8}>{props.dashboard.organization && props.dashboard.organization.name}</Col>
        </Row>
    </Container>
);


export default DashboardOverview;
