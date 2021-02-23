import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import updateTopic from '../../../api/Organization/updateTopic';
import useClient from '../../../api/client';

const FormStyled = styled.div`
border-left:4px solid lightblue;
padding-left: 2em;
height: 12rem;
`;

const EditTopicForm = (props) => {
    const client = useClient();
    const params = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({ label: '', description: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const fetchTopic = async () => {

    };
    const saveTopic = async () => {
        const response = await client.mutate(
            updateTopic({
                topicUri: params.topicuri,
                input: formData
            })
        );
        if (!response.errors) {
            toast(`Saved topic ${formData.label}`);
            history.goBack();
        } else {
            toast(`Could not saved ne topic, received ${response.errors[0].message}`);
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <h5>Edit Topic</h5>
                </Col>
            </Row>
            <FormStyled>
                <Row>
                    <Col xs={10}>
                        Topic
                    </Col>
                    <Col xs={6}>
                        <input
                            name={'label'}
                            value={formData.label}
                            onChange={handleInputChange}
                            style={{ width: '100%' }}
                            className={'form-control'}
                        >
                        </input>
                    </Col>
                </Row>
                <Row>
                    <Col xs={10}>
                        Description
                    </Col>
                    <Col xs={6}>
                        <input
                            name={'description'}
                            value={formData.description}
                            onChange={handleInputChange}
                            style={{ width: '100%' }}
                            className={'form-control'}
                        >

                        </input>
                    </Col>
                </Row>
                <Row className={'mt-3'}>
                    <Col xs={4}>
                        <div className={'btn-group'}>
                            <div onClick={saveTopic} className={'btn btn-sm btn-primary'}>
                                Save
                            </div>

                            <Link to={`/organization/${props.organization.organizationUri}/dashboard/topics`}>
                                <div className={'btn btn-sm btn-secondary'}>
                                    Cancel
                                </div>
                            </Link>

                        </div>
                    </Col>
                </Row>
            </FormStyled>
        </React.Fragment>
    );
};


export default EditTopicForm;
