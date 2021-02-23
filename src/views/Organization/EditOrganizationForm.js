import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner, Button
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


const Background = styled.div`
margin-top: 4%;
margin-right: 5px;
z-index: 10;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid #24a8c9;
overflow-y:auto;
overflow-x: hidden;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
.form-group {
    margin-bottom: 1.6em;
  }
.error {
    border: 2px solid #FF6565;
  }
.error-message {
color: #FF6565;
padding: .5em .2em;
height: 1em;
position: absolute;
font-size: .8em;
}
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
            <Background>
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
                        <div onClick={onSubmit} className={'btn btn-info btn-sm'}>
                            Edit
                        </div>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={() => { history.push('/organizations'); }} className="btn-primary btn-sm" type="submit">
                            <b>Cancel</b>
                        </Button>
                    </Col>
                </Row>
            </Background>
        </Container>
    );
};


export default EditOrganizationForm;
