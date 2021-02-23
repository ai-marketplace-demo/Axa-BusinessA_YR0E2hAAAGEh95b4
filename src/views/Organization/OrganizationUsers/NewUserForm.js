import React, { useState } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import {
    Link, useParams, useLocation, useHistory
} from 'react-router-dom';
import { toast } from 'react-toastify';
import useClient from '../../../api/client';
import inviteUser from '../../../api/Organization/inviteUser';

const FormStyled = styled.div`
border: 1px lightgrey solid;
height:15em;
border-radius: 0px Opx 5px 5px;
border-left: 7px solid lightblue;
padding: 3em;
width:70%;
box-shadow: 0px 1px 0px 1px lightyellow;
`;

const NewUserForm = (props) => {
    const options = [
        { value: 'Member', label: 'Member' },
        { value: 'Admin', label: 'Admin' }
    ];

    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const [ready, setReady] = useState(false);
    const [formData, setFormData] = useState({ userName: '', organizationUri: '', role: options[0] });

    const client = useClient();
    const org = location.state;

    console.log('ORG === , ', org);

    const submitForm = async () => {
        console.log('formData ==>', formData);
        const res = await client.mutate(
            inviteUser({
                organizationUri: org.organizationUri,
                userName: formData.userName,
                role: formData.role.value
            })
        );
        toast(`Invited ${formData.userName} to ${org.label}`, {
            hideProgressBar: true,
            autoClose: true,
            onClose: () => {
                history.goBack();
            }
        });
    };

    const handleChange = ((e) => setFormData({ ...formData, [e.target.name]: e.target.value }));


    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Link
                        style={{ color: 'black' }}
                        to={{
                            state: location.state,
                            pathname: `/organization/${params.uri}/users`
                        }}
                    ><Icon.ChevronLeft size={36} />
                    </Link>
                </Col>
                <Col xs={11}>
                    <h3>Invite new user in Organization <b className={'text-primary'}>{location.state.label}</b></h3>
                </Col>
            </Row>
            <FormStyled className={'mt-5'}>
                <Row>
                    <Col className="pt-2" xs={1}><h6><b>User</b></h6></Col>
                    <Col xs={4}>
                        <input name="userName" value={formData.userName} onChange={handleChange} placeholder={'enter user name'} style={{ width: '100%' }} />
                    </Col>

                </Row>
                <Row className={'mt-2'}>
                    <Col className="pt-2" xs={1}><h6><b>Role</b></h6></Col>
                    <Col xs={4}>
                        <Select
                            onChange={(selectedOption) => { handleChange({ target: { name: 'role', value: selectedOption } }); }}
                            name="role"
                            value={formData.role}
                            options={options}
                        />
                    </Col>
                </Row>
                <Row className={'mt-3'}>
                    <Col xs={1} />
                    <Col xs={2}>
                        <div onClick={submitForm} className={'btn btn-success'}>
                            Invite
                        </div>
                    </Col>
                </Row>
            </FormStyled>
        </Container>
    );
};


export default NewUserForm;
