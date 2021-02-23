import React, { userState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';


const Styled = styled.div`
border : 1px lightgrey solid;
border-left:4px lightgreen solid;
padding-left: 4ch;
padding-top:2ch;
width:80%;
height:25ch;
`;

const EnvironmentConnection = (props) => {
    const env = props.environment;

    return (
        <Container>
            <Row>
                <Col xs={10}>
                    <h4>Access </h4>
                </Col>
            </Row>
            <Styled>
                <Row>
                    <Col xs={2}><b>Organization</b></Col>
                    <Col xs={8}>
                        {env.organization.name}
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}><b>IDP Group</b></Col>
                    <Col xs={8}>
                        {env.cognitoGroupName}
                    </Col>
                </Row>

                <Row>
                    <Col xs={2}><b>Name</b></Col>
                    <Col xs={8}>
                        {env.name}
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}><b>AWS</b></Col>
                    <Col xs={2}>{env.AwsAccountId}</Col>
                </Row>
                <Row>
                    <Col xs={2}><b>Region</b></Col>
                    <Col xs={2}>{env.region}</Col>
                </Row>
                <Row>
                    <Col xs={2}><b>Admin</b></Col>
                    <Col xs={2}>{env.owner}</Col>
                </Row>
            </Styled>
        </Container>
    );
};


export default EnvironmentConnection;
