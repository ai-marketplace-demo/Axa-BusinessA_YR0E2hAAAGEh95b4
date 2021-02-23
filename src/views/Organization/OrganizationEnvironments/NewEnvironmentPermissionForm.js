import React, { useState } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import { Link, useParams, useLocation } from 'react-router-dom';


const FormStyled = styled.div`
border: 1px lightgrey solid;
height:15em;
border-radius: 0px Opx 5px 5px;
border-left: 7px solid lightblue;
padding: 3em;
width:70%;
box-shadow: 0px 8px 3px  lightgrey;
`;

const NewEnvironmentPermissionForm = (props) => {
    const params = useParams();
    const location = useLocation();
    console.log('location = ', location);
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState(null);

    const options = [
        { value: 'admin', label: 'Admin' },
        { value: 'contributor', label: 'Contributor' },
        { value: 'viewew', label: 'Viewer' }
    ];

    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Link
                        style={{ color: 'black' }}
                        to={{
                            state: location.state,
                            pathname: `/environment/${params.uri}/permissions`
                        }}
                    ><Icon.ChevronLeft size={36} />
                    </Link>
                </Col>
                <Col xs={11}>
                    <h3>Grant Permission on Environment <b className={'text-secondary'}>{location.state.environment.label}</b>
                        (in Organization <b className={'text-primary'}>{location.state.organization.label}</b>)
                    </h3>
                </Col>
            </Row>
            <FormStyled className={'mt-5'}>
                <Row>
                    <Col className="pt-2" xs={3}><h6><b>Username</b></h6></Col>
                    <Col xs={4}>
                        <input placeholder={'enter user name'} style={{ width: '100%' }} />
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-2" xs={3}><h6><b>Role</b></h6></Col>
                    <Col xs={4}>
                        <Select options={options} />
                    </Col>
                </Row>
                <Row className={'mt-3'}>
                    <Col xs={3} />
                    <Col xs={4}>
                        <div className={'btn btn-success'}>
                            Grant!
                        </div>
                    </Col>
                </Row>

            </FormStyled>
        </Container>
    );
};


export default NewEnvironmentPermissionForm;
