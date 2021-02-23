import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useClient from '../../../api/client';
import addProjectTrustRelationship from '../../../api/Project/addProjectTrustRelationship';

dayjs.extend(relativeTime);


const FormStyled = styled.div`
height: 21rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid #24a8c9;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`;


const NewProjectRelationship = (props) => {
    const history = useHistory();
    const client = useClient();

    const [formData, setFormData] = useState({
        IAMPrincipalArn: `arn:aws:iam::${props.project.environment.AwsAccountId}:role/<ROLENAME>`,
        description: '',
        label: '',
        tags: [],
    });

    const handleInputChange = async (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    useEffect(() => {

    }, [client]);


    const onSubmit = async () => {
        const res = await client.mutate(
            addProjectTrustRelationship({
                projectUri: props.project.projectUri,
                input: {
                    label: formData.label,
                    IAMPrincipalArn: formData.IAMPrincipalArn,
                    description: formData.description,
                    tags: formData.tags,
                }
            })
        );
        if (!res.errors) {
            toast(`Added new trust ${formData.IAMPrincipalArn} `, {
                hideProgressBar: true
            });
        } else {
            toast.error(`Could not add trust, received ${res.errors[0].message}`, {
                hideProgressBar: true
            });
        }
    };


    return (
        <Container>
            <Row className={'mt-2'}>
                <Col xs={1}>
                    <Link
                        style={{ color: 'black' }}
                        to={`/project/${props.project.projectUri}/trusts`}
                    >
                        <h4><Icon.ChevronLeft xs={36} /></h4>
                    </Link>
                </Col>
                <Col xs={8}>
                    <h4>Add New Trust Relationship for Project</h4>
                </Col>
            </Row>
            <FormStyled>
                <Row className={'mt-4'}>

                    <Col xs={3}>AWS Principal Arn</Col>
                    <Col xs={8}>
                        <input
                            placeholder={'arn:aws:iam::account-id:role/role-name-with-path'}
                            className={'form-control'}
                            name={'IAMPrincipalArn'}
                            onChange={handleInputChange}
                            style={{ width: '100%' }}
                            value={formData.IAMPrincipalArn}
                        />
                    </Col>
                </Row>
                <Row style={{ zIndex: '-1' }} className={'mt-2'}>
                    <Col xs={3}>Label</Col>
                    <Col xs={8}>
                        <input name={'label'} onChange={handleInputChange} style={{ width: '100%' }} value={formData.label} />
                    </Col>

                </Row>
                <Row style={{ zIndex: '-1' }} className={'mt-2'}>
                    <Col xs={3}>Description</Col>
                    <Col xs={8}>
                        <input name={'description'} onChange={handleInputChange} style={{ width: '100%' }} value={formData.description} />
                    </Col>

                </Row>
                <Row className={'mt-2'}>
                    <Col xs={3}>Tags</Col>
                    <Col xs={8}>
                        <ReactTagInput
                            tags={formData.tags}
                            onChange={(newTags) => handleInputChange({ target: { name: 'tags', value: newTags } })}
                        />
                    </Col>
                </Row>
                <Row className={'mt-2'}>
                    <Col xs={3} />
                    <Col xs={4}>
                        <div onClick={onSubmit} className={'btn-sm btn btn-primary'}>Add</div>
                    </Col>
                </Row>
            </FormStyled>
        </Container>
    );
};


export default NewProjectRelationship;
