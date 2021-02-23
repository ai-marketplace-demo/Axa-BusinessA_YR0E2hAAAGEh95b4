import React, { useState, useEffect } from 'react';
import {
    Link, Switch, Route, useHistory
} from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import useClient from '../../api/client';
import addTenantAdmin from '../../api/Tenant/addTenantAdmin';


const StyledForm = styled.div`
padding-top:1em;
height:10rem;
padding-left: 3ch;
width:70%;
border : 1px solid lightgrey;
border-left: #61dafb 4px solid;
`;

const NewTenantAdminForm = (props) => {
    const client = useClient();
    const history = useHistory();
    const [userName, setUserName] = useState('');


    const submitForm = async () => {
        const response = await client.mutate(addTenantAdmin(userName));
        if (!response.errors) {
            history.goBack();
        } else {
            toast(`Could not add new Tenant administrator, received ${response.errors[0].message}`);
        }
    };
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h4>Add New Tenant Administrator</h4>
                </Col>
            </Row>
            <StyledForm>
                <Row className={''}>
                    <Col xs={2}>
                        <b>Username</b>
                    </Col>
                    <Col xs={6}>
                        <input className={'form-control'} value={userName} onChange={(e) => { setUserName(e.target.value); }} />
                    </Col>
                </Row>
                <Row className={'mt-4'}>
                    <Col xs={2} />
                    <Col xs={4}>
                        <div className={'btn-group'}>
                            <div onClick={submitForm} className={'btn btn-sm btn-primary'}>Add</div>
                            <div onClick={() => { history.goBack(); }} className={'btn btn-sm btn-secondary'}>Cancel</div>
                        </div>
                    </Col>
                </Row>

            </StyledForm>
        </Container>
    );
};


export default NewTenantAdminForm;
