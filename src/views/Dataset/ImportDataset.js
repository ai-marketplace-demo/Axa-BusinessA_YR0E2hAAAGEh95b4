import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Base, Spinner, Form, Button
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
import {
    Link, useParams, useLocation, useHistory
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { If, Then, Else } from 'react-if';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useClient from '../../api/client';
import useGroups from '../../api/useGroups';
import importDataset from '../../api/Dataset/importDataset';
import listOrganizationEnvironments from '../../api/Environment/listOrganizationEnvironments';
import listOrganizations from '../../api/Organization/listOrganizations';
import { AwsRegionsSelect, getRegionLabel } from '../../components/AwsRegions/AwsRegionSelect';


const Background = styled.div`
margin-top: -0px;
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

const Languages = [
    { label: 'German', value: 'German' },
    { label: 'English', value: 'English' },
    { label: 'French', value: 'French' },
];

const Classificiations = [
    { label: 'C1', value: 'C1' },
    { label: 'C2', value: 'C2' },
    { label: 'C3', value: 'C3' },
];


const Topics = Object.keys({
    Finances: 'Finances',
    HumanResources: 'HumanResources',
    Products: 'Products',
    Services: 'Services',
    Operations: 'Operations',
    Research: 'Research',
    Sales: 'Sales',
    Orders: 'Orders',
    Sites: 'Sites',
    Energy: 'Energy',
    Customers: 'Customers',
    Misc: 'Misc'
}).map((k) => ({ label: k, value: k }));

const ImportDatasetForm = (_props) => {
    const location = useLocation();
    const history = useHistory();
    const [submitting, setSubmitting] = useState(false);
    const [dataset, setDataset] = useState({
        General: {},
        Environment: {},
        Details: {}
    });
    const client = useClient();
    const groups = useGroups();


    const [formData, setFormData] = useState({
        label: '',
        region: {},
        description: 'dataset description',
        topics: [],
        SamlAdminGroupName: groups ? groups[0] : 'Choose an administrator group',
        language: Languages[0],
        owner: '',
        stewards: [],
        bucketName: '',
        confidentiality: Classificiations[0],
        tags: []
    });

    const [org, setOrg] = useState({ label: null, value: null });
    const [orgs, setOrgs] = useState([]);
    const [env, setEnv] = useState({ label: null, value: null, region: { value: '', label: '' } });
    const [envs, setEnvs] = useState([]);
    const [tags, setTags] = useState([]);
    const [stewards, setStewards] = useState([]);
    const [topics, setTopics] = useState([]);

    const selectOrg = async (selectOption) => {
        setOrg(selectOption);
        const res = await client.query(listOrganizationEnvironments({
            organizationUri: selectOption.value,
            filter: {
                page: 1,
                roles: ['Admin', 'Owner', 'Invited', 'DatasetCreator'],
                pageSize: 10
            }
        }));
        if (!res.errors) {
            setEnvs(res.data.getOrganization.environments.nodes.map((e) => ({
                label: `${e.label}(${e.SamlGroupName})`,
                value: e.environmentUri,
                region: { label: getRegionLabel(e.region), value: e.region }
            })));
        }
    };

    const selectStewards = (selectOption) => {
        setStewards(selectOption);
    };

    const selectEnv = (selectOption) => {
        setEnv(selectOption);
    };

    const selectTopic = (selectOption) => {
        setTopics(selectOption);
    };


    useEffect(() => {
        if (client) {
            client
                .query(listOrganizations({ filter: { roles: ['Admin', 'Member', 'Owner'] } }))
                .then((res) => {
                    setOrgs(res.data.listOrganizations.nodes.map((org) => ({ label: `${org.label} (${org.organizationUri})`, value: org.organizationUri })));
                });
        }
    }, [client, submitting]);

    const validationSchema = Yup.object().shape({
        label: Yup.string()
            .min(2, '*Dataset name must have at least 2 characters')
            .max(52, "*Dataset name can't be longer than 52 characters")
            .required('*Dataset name is required'),
        bucketName: Yup.string()
            .min(1, '*Bucket name must have at least 1 character')
            .max(63, "*Bucket name can't be longer than 63 characters")
            .required('*Bucket name is required')
    });

    const submitForm = async (formData) => {
        setSubmitting(true);
        const input = {
            label: formData.label,
            bucketName: formData.bucketName,
            language: formData.language,
            confidentiality: formData.confidentiality,
            topics: topics ? topics.map((t) => t.value) : [],
            tags,
            owner: formData.owner,
            SamlAdminGroupName: formData.SamlAdminGroupName,
            businessOwnerEmail: formData.owner,
            businessOwnerDelegationEmails: stewards ? stewards.map((s) => s.value) : [],
            description: formData.description,
            environmentUri: env.value,
            organizationUri: org.value
        };
        const res = await client.mutate(
            importDataset(input)
        );
        setSubmitting(false);
        if (!res.errors) {
            toast(`Created Dataset ${formData.label} in ${org.label}/${env.label}`, {
                hideProgressBar: true,
                onClose: () => { history.goBack(); }
            });
        } else {
            toast.error(`An error was returned ${res.errors[0].message}`);
        }
    };

    return (
        <Container>

            <Row>
                <Col xs={12} className={'mt-3 mb-3'}>
                    <h4>
                        <Icon.Folder className={'ml-3'} />
                        <span className={'ml-2'}>Import Dataset</span>
                    </h4>
                </Col>
                <Col xs={2}>
                    <If condition={submitting}>
                        <Then>
                            <Spinner variant={'primary'} animation={'border'} />
                        </Then>
                    </If>
                </Col>
            </Row>
            <Background>
                <Formik
                    enableReinitialize
                    initialValues={formData}
                    validationSchema={validationSchema}
                    onSubmit={(formData, { setSubmitting, resetForm }) => {
                        submitForm(formData);
                    }}
                >
                    {/* Callback function containing Formik state and helpers that handle common form actions */}
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue
                    }) => (

                        <Form onSubmit={handleSubmit} className="mx-auto">
                            {console.log(values)}
                            <Row>
                                <Col xs={2}><b>Settings</b></Col>
                                <Col xs={10}>
                                    <Row>

                                        <Col xs={1}><b>Org</b></Col>
                                        <Col xs={3}>
                                            <Select
                                                value={orgs ? orgs.find((option) => option.value === values.org) : ''}
                                                onChange={selectOrg}
                                                options={orgs}
                                            />
                                        </Col>
                                        <Col xs={1}><b>Env</b></Col>
                                        <Col xs={3}>
                                            <Select
                                                value={envs ? envs.find((option) => option.value === values.env) : ''}
                                                onChange={selectEnv}
                                                options={envs}
                                            />
                                        </Col>
                                        <Col xs={1}><b>Region</b></Col>
                                        <Col xs={3}>
                                            <Select
                                                isDisabled
                                                value={values.env && values.env.region ? values.env.region : ''}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className={'mt-1'}>
                                        <Col xs={1}><b>Lang</b></Col>
                                        <Col xs={3}>
                                            <Select
                                                value={Languages ? Languages.find((option) => option.value === values.confidentiality) : ''}
                                                onChange={(option) => setFieldValue('language', option.value)}
                                                options={Languages}
                                            />
                                        </Col>
                                        <Col xs={1}><b>Class</b></Col>
                                        <Col xs={3}>
                                            <Select
                                                value={Classificiations ? Classificiations.find((option) => option.value === values.confidentiality) : ''}
                                                onChange={(option) => setFieldValue('confidentiality', option.value)}
                                                options={Classificiations}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Group controlId="label">
                                <Form.Label><b>Dataset name</b></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="label"
                                    placeholder="dataset name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.label}
                                    className={touched.label && errors.label ? 'error' : null}
                                />
                                {touched.label && errors.label ? (
                                    <div className="error-message">{errors.label}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group controlId="bucketName">
                                <Form.Label><b>Amazon S3 bucket name</b></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bucketName"
                                    placeholder="Amazon S3 bucket name on AWS"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.bucketName}
                                    className={touched.bucketName && errors.bucketName ? 'error' : null}
                                />
                                {touched.bucketName && errors.bucketName ? (
                                    <div className="error-message">{errors.bucketName}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label><b>Description</b></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    type="textarea"
                                    name="description"
                                    placeholder="Dataset description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    className={touched.description && errors.description ? 'error' : null}
                                />
                                {touched.description && errors.description ? (
                                    <div className="error-message">{errors.description}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group controlId="SamlAdminGroupName">
                                <Form.Label><b>Admin group</b></Form.Label>
                                <Select
                                    value={groups ? groups.find((option) => option.value === values.SamlAdminGroupName) : ''}
                                    onChange={(option) => setFieldValue('SamlAdminGroupName', option.value)}
                                    options={(groups && groups || []).map((g) => ({ label: g, value: g }))}
                                />
                                {touched.SamlAdminGroupName && errors.SamlAdminGroupName ? (
                                    <div className="error-message">{errors.SamlAdminGroupName}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group controlId="owner">
                                <Form.Label><b>Business owner</b></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="owner"
                                    placeholder="Datahub user username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.owner}
                                    className={touched.owner && errors.owner ? 'error' : null}
                                />
                                {touched.owner && errors.owner ? (
                                    <div className="error-message">{errors.owner}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group controlId="stewards">
                                <Form.Label><b>Stewards</b></Form.Label>
                                <Creatable
                                    isMulti
                                    placeholder={'Emails for dataset stewards'}
                                    onChange={selectStewards}
                                    isClearable
                                    options={[]}
                                />
                                {touched.stewards && errors.stewards ? (
                                    <div className="error-message">{errors.stewards}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group controlId="topics">
                                <Form.Label><b>Topic</b></Form.Label>
                                <Select
                                    value={topics}
                                    isMulti
                                    onChange={selectTopic}
                                    options={Topics}
                                />
                                {touched.topics && errors.topics ? (
                                    <div className="error-message">{errors.topics}</div>
                                ) : null}
                            </Form.Group>
                            <Form.Group controlId="topics">
                                <Form.Label><b>Tags</b></Form.Label>
                                <ReactTagInput
                                    tags={tags}
                                    onChange={(newTags) => setTags(newTags)}
                                />
                                {touched.tags && errors.tags ? (
                                    <div className="error-message">{errors.tags}</div>
                                ) : null}
                            </Form.Group>

                            <Row className={'mt-4'}>
                                <Col xs={2}>
                                    <Button className="btn-info btn-sm" type="submit" disabled={submitting}>
                                        <b>Import</b>
                                    </Button>
                                </Col>
                                <Col xs={2}>
                                    <Button onClick={() => { history.push('/datasets'); }} className="btn-primary btn-sm" type="submit" disabled={submitting}>
                                        <b>Cancel</b>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Background>


        </Container>
    );
};

export default ImportDatasetForm;
