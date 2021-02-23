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
import createGroup from '../../../api/Organization/createGroup';

const FormStyled = styled.div`
border: 1px lightgrey solid;
height:20em;
border-radius: 0px Opx 5px 5px;
border-left: 7px solid lightblue;
padding: 3em;
width:70%;
box-shadow: 0px 8px 3px  lightgrey;
`;

const NewGroupForm = (props) => {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const organization = location.state;
    const client = useClient();
    console.log('location = ', location);
    const [ready, setReady] = useState(false);
    const [formData, setFormData] = useState({
        label: '',
        description: '',
        tags: [],
        role: { label: 'Member', value: 'Member' }
    });


    const submitForm = async () => {
        console.log('formData  =>', formData);
        await client.mutate(createGroup({
            organizationUri: organization.organizationUri,
            label: formData.label,
            description: formData.description,
            tags: formData.tags,
            role: formData.role.value
        }
        ));
        toast('Created Group', {
            hideProgressBar: true,
            autoClose: true,
            onClose: () => {
                history.goBack();
            }
        });
    };


    let options = [
        { label: 'Member', value: 'Member' }
    ];

    let selectEnabled = false;

    if (organization.userRoleInOrganization == 'Admin' | organization.userRoleInOrganization == 'Owner') {
        options = [
            { label: 'Member', value: 'Member' },
            { label: 'Admin', value: 'Admin' },
        ];
        selectEnabled = true;
    }


    const handleChange = ((e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); });
    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Link
                        style={{ color: 'black' }}
                        to={{
                            state: location.state,
                            pathname: `/organization/${params.uri}/groups`
                        }}
                    ><Icon.ChevronLeft size={36} />
                    </Link>
                </Col>
                <Col xs={11}>
                    <h3>Create New Group in Organization <b className={'text-primary'}>{location.state.label}</b></h3>
                </Col>
            </Row>
            <FormStyled className={'mt-5'}>
                <Row>
                    <Col className="pt-2" xs={3}><h6><b>Group</b></h6></Col>
                    <Col xs={5}>
                        <input name="label" value={formData.label} onChange={handleChange} placeholder={'enter group name'} style={{ width: '100%' }} />
                    </Col>

                </Row>
                <Row className={'mt-1'}>
                    <Col className="pt-2" xs={3}><h6><b>Description</b></h6></Col>
                    <Col xs={5}>
                        <textarea
                            rows="3"
                            className={'form-control'}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder={'what is this group about ?'}
                            style={{ width: '100%' }}
                        />
                    </Col>

                </Row>
                <Row className={'mt-2'}>
                    <Col className="pt-2" xs={3}><h6><b>Role</b></h6></Col>
                    <Col xs={5}>
                        <Select
                            isDisabled={!selectEnabled}
                            value={formData.role}
                            onChange={(selectOption) => { handleChange({ target: { name: 'role', value: selectOption } }); }}
                            options={options}
                        />
                    </Col>
                </Row>
                <Row className={'mt-3'}>
                    <Col xs={3} />
                    <Col xs={5}>
                        <div onClick={submitForm} className={'btn btn-info'}>
                            Create
                        </div>
                    </Col>
                </Row>
            </FormStyled>
        </Container>
    );
};


export default NewGroupForm;
