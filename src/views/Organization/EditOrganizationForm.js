import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import Select from 'react-select';
import {
    Link, useParams, useHistory, useLocation
} from 'react-router-dom';
import useClient from '../../api/client';
import updateOrganization from '../../api/Organization/updateOrganization';


const FormStyled = styled.div`
border: 1px lightgrey solid;
height:18em;
border-radius: 0px Opx 5px 5px;
border-left: 7px solid lightblue;
padding: 3em;
width:80%;
box-shadow: 0px 1px 0px 2px lightyellow;
`;

const EditOrganizationForm = (props) => {
    const params = useParams();
    const client = useClient();
    const location = useLocation();
    const history = useHistory();
    const [ready, setReady] = useState(true);
    const org = location.state.organization;

    const [formData, setFormData] = useState(org);
    const [tags, setTags] = useState(org.tags);

    const onSubmit = async () => {
        console.log(formData);
        await client.mutate(updateOrganization({ ...formData, tags }));
        history.goBack();
    };
    const handleInputChange = (e) => setFormData({
        ...formData,
        [e.target.name]: e.currentTarget.value
    });

    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Link style={{ color: 'black' }} to={'/organizations'}><Icon.ChevronLeft size={36} /></Link>
                </Col>
                <Col xs={11}>
                    <h3>Edit Organization <b className={'text-primary'}>{formData.label}</b></h3>
                </Col>
            </Row>
            <FormStyled className={'mt-5'}>
                <Row>
                    <Col className="pt-2" xs={3}><h6><b>Name</b></h6></Col>
                    <Col xs={5}>
                        <input className={'form-control'} name={'label'} onChange={handleInputChange} value={formData.label} style={{ width: '100%' }} />
                    </Col>

                </Row>
                <Row className={'mt-1'}>
                    <Col className="pt-2" xs={3}><h6><b>Description</b></h6></Col>
                    <Col xs={5}>
                        <input className={'form-control'} name={'description'} onChange={handleInputChange} value={formData.description} style={{ width: '100%' }} />
                    </Col>

                </Row>
                <Row className={'mt-1'}>
                    <Col className="pt-2" xs={3}><h6><b>Saml Group Name</b></h6></Col>
                    <Col xs={5}>
                        <input className={'form-control'} name={'SamlGroupName'} onChange={handleInputChange} value={formData.SamlGroupName} style={{ width: '100%' }} />
                    </Col>
                </Row>
                <Row className={'mt-2'}>
                    <Col className="pt-2" xs={3}><h6><b>Tags</b></h6></Col>
                    <Col xs={8}>
                        <ReactTagInput
                            tags={tags}
                            onChange={(newTags) => setTags(newTags)}
                        />

                    </Col>
                </Row>

                <Row className={'mt-3'}>
                    <Col xs={3} />
                    <Col xs={2}>
                        <div className={'btn-group'}>
                            <div onClick={onSubmit} className={'btn btn-success'}>
                                Save
                            </div>
                            <div className={'btn btn-info'}>
                                <Link className="text-white" to={'/organizations'}> Cancel</Link>
                            </div>

                        </div>
                    </Col>
                </Row>
            </FormStyled>
        </Container>
    );
};


export default EditOrganizationForm;
