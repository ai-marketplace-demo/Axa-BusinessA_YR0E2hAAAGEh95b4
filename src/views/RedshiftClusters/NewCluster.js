import React, {useState, useEffect} from "react";
import {Container, Row, Col, Spinner, Form, Button} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import useClient from "../../api/client";
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {toast} from"react-toastify"
import createRedshiftCluster from "../../api/RedshiftCluster/createCluster";
import {If, Then} from "react-if";
import Select from "react-select";
import listOrganizationEnvironments from "../../api/Environment/listOrganizationEnvironments";
import {getRegionLabel} from "../../components/AwsRegions/AwsRegionSelect";
import listOrganizations from "../../api/Organization/listOrganizations";



const Background=styled.div`
margin-top: -0px;
margin-right: 5px;
z-index: 10;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightcoral;
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
`


const NewRedshiftCluster= (props)=>{
    let history = useHistory();
    let client=useClient();
    let [submitting, setSubmitting] = useState(false);
    let [isSingleNode, setSingleNode] = useState(true);
    let [orgs,setOrgs] = useState([])
    let [envs, setEnvs] = useState([]);
    let [formData, setFormData]=useState({
        label: "",
        nodeType: "",
        masterDatabaseName: "",
        masterUsername: "",
        vpc: "",
        numberOfNodes: "",
        clusterType: "",
        clusterIdentifier: "",
        env: {},
        org:{},
        SamlGroupName: '',
        tags:[]
    });
    const selectOrg=async (selectOption)=>{
        setFormData({...formData, org:selectOption});
        const res = await client.query(listOrganizationEnvironments({organizationUri:selectOption.value}));
        if (!res.errors){
            setEnvs(res.data.getOrganization.environments.nodes.map((e)=>{
                return {label : e.label, value:e.environmentUri, region:{label:getRegionLabel(e.region),value:e.region}}
            }))
        }
    };
    const selectEnv= (selectOption)=>{
        setFormData({...formData, env: selectOption});
    }
    const validationSchema = Yup.object().shape({
        label: Yup.string()
            .min(2, "*Cluster name must have at least 2 characters")
            .max(63, "*Cluster name can't be longer than 63 characters")
            .required("*Cluster name is required"),
        nodeType: Yup.string()
            .required("*Node Type is required"),
        masterDatabaseName: Yup.string()
            .matches("^[a-zA-Z]*$", "*Database name is not valid (^[a-zA-Z]*$)")
            .min(2, "*Database name must have at least 2 characters")
            .max(60, "*Database name name can't be longer than 60 characters")
            .required("*Database name is required"),
        masterUsername: Yup.string()
            .matches("^[a-zA-Z]*$", "*Username is not valid (^[a-zA-Z]*$)")
            .min(2, "*Username name must have at least 2 characters")
            .max(60, "*Username name name can't be longer than 60 characters")
            .required("*Username name is required"),
        numberOfNodes: Yup.number()
            .required("*Number of nodes is required"),
        vpc: Yup.string()
            .matches("vpc-*", "*VPC Id is not valid")
            .required("*VPC Id is required"),
    });
    const clusterTypes = [{label:'single node', value: 'single-node'}, {label:'multi node', value: 'multi-node'}];
    const nodeTypes = [
        {label: 'dc2.large', value: 'dc2.large'},
        {label: 'ds2.xlarge', value: 'ds2.xlarge'},
        {label: 'ds2.8xlarge', value: 'ds2.8xlarge'},
        {label: 'dc1.large', value: 'dc1.large'},
        {label: 'dc2.8xlarge', value: 'dc2.8xlarge'},
        {label: 'ra3.16xlarge', value: 'ra3.16xlarge'}
    ];
    useEffect(()=>{
        if (client){
            client
                .query(listOrganizations({filter:{roles:['Admin','Member','Owner']}}))
                .then((res)=>{
                    setOrgs(res.data.listOrganizations.nodes.map((org)=>{
                        return {label : org.label+` (${org.organizationUri})`,value:org.organizationUri}
                    }));
                })
        }
    },[client]);


    const submitForm=async (formData)=>{
        setSubmitting(true);
        const environmentUri = formData.env.value;
        delete formData.env;
        delete formData.org;
        delete formData.clusterIdentifier;
        delete formData.clusterType;
        const response = await client.mutate(createRedshiftCluster({
            environmentUri : environmentUri,
            input:formData
        }));
        setSubmitting(false);
        if (!response.errors){
            toast(`Created New ML Pipeline`,{
                hideProgressBar:true,
                onClose:()=>{history.goBack()}
            })
        }
        else {
            toast(`Could not create new ML Pipeline!, received ${response.errors[0].message}`)
        }
    };

    const slugifyClusterResourceName = (name = '') => {
        if (name === '') {
            return '';
        }
        const DH_PREFIX = 'dh';
        return DH_PREFIX
            .concat(name
                .trim()
                .replace(/[^a-zA-Z]/g, '')
                .toLowerCase()).substring(0, 50)
            .concat(Math.random().toString(36).substring(8));
    };


    return <Container>
        <Row>
            <Col xs={1}>
                <Link
                    to={{
                        pathname: `/redshiftclusters`
                    }}
                    style={{color: 'black'}}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={10}>

                <h4>New Amazon Redshift Cluster</h4>
            </Col>
            <Col xs={12}>
                <If condition={submitting}>
                    <Then>
                        <Spinner variant={'primary'} animation={`border`}/>
                    </Then>
                </If>
            </Col>
        </Row>
        <Background>
            <Formik
                enableReinitialize
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={(formData, {setSubmitting, resetForm}) => {
                    submitForm(formData)
                }}
            >
                {/* Callback function containing Formik state and helpers that handle common form actions */}
                {( {values,
                       errors,
                       touched,
                       handleChange,
                       handleBlur,
                       handleSubmit,
                       isSubmitting ,
                       setFieldValue}) => (

                    <Form onSubmit={handleSubmit} className="mx-auto">
                        {console.log(values)}
                        <Row>
                            <Col xs={2}><b>Settings</b></Col>
                            <Col xs={10}>
                                <Row>

                                    <Col xs={1}><b>Org</b></Col>
                                    <Col xs={3}>
                                        <Select
                                            value={orgs ? orgs.find(option => option.value === values.org) : ''}
                                            onChange={selectOrg}
                                            options={orgs}
                                        />
                                    </Col>
                                    <Col xs={1}><b>Env</b></Col>
                                    <Col xs={3}>
                                        <Select
                                            value={envs ? envs.find(option => option.value === values.env) : ''}
                                            onChange={selectEnv}
                                            options={envs}
                                        />
                                    </Col>
                                    <Col xs={1}><b>Region</b></Col>
                                    <Col xs={3}>
                                        <Select
                                            isDisabled={true}
                                            value={values.env && values.env.region ? values.env.region : ''}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Form.Group controlId="label">
                            <Form.Label><b>Cluster Name</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="label"
                                placeholder="cluster name"
                                onChange={(event) => {
                                    setFieldValue('label', event.target.value);
                                    setFieldValue('clusterIdentifier', slugifyClusterResourceName(
                                        event.target.value));
                                }}
                                onBlur={handleBlur}
                                value={values.label}
                                className={touched.label && errors.label ? "error" : null}
                            />
                            {touched.label && errors.label ? (
                                <div className="error-message">{errors.label}</div>
                            ): null}
                        </Form.Group>

                        <Form.Group controlId="label">
                            <Form.Label><b>Amazon Redshift Cluster Identifier</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="clusterIdentifier"
                                disabled
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.clusterIdentifier}
                                className={touched.clusterIdentifier && errors.clusterIdentifier ? "error" : null}
                            />
                            <small className="attribute-label">
                                The identifier must be from 1 to 63 characters. Valid characters are a-z (lowercase only) and - (hyphen).
                            </small>
                            {touched.label && errors.label ? (
                                <div className="error-message">{errors.label}</div>
                            ): null}
                        </Form.Group>

                        <div className="mb-3">
                            <label className="label-form cluster-label-form">Cluster Type</label>
                            <Select
                                value={clusterTypes ? clusterTypes.find(option => option.value === values.clusterType) : ''}
                                onChange={(event) => {
                                    setFieldValue('clusterType', event.value);
                                    if (event.value === 'single-node') {
                                        setFieldValue('numberOfNodes', 1);
                                        setSingleNode(true);
                                    }
                                    else {
                                        setFieldValue('numberOfNodes', 2);
                                        setSingleNode(false)
                                    }
                                }}
                                options={clusterTypes}
                            />
                        </div>

                        <Form.Group controlId="numberOfNodes">
                            <Form.Label><b>Number of Nodes</b></Form.Label>
                            <div>
                                <small className="attribute-label">
                                    <a href={'https://aws.amazon.com/redshift/pricing/'} target="_blank" rel="noopener noreferrer">
                                        Learn more about Redshift pricing <i className="fas fa-external-link-alt"></i>
                                    </a>
                                </small>
                            </div>
                            <Form.Control
                                type="number"
                                name="label"
                                placeholder="1"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numberOfNodes}
                                disabled={isSingleNode}
                                className={touched.numberOfNodes && errors.numberOfNodes ? "error" : null}
                            />
                            <small className="attribute-label">
                                Range (1-128)
                            </small>
                            {touched.numberOfNodes && errors.numberOfNodes ? (
                                <div className="error-message">{errors.numberOfNodes}</div>
                            ): null}
                        </Form.Group>

                        <Form.Group controlId="nodeType">
                            <Form.Label><b>Node Type</b></Form.Label>
                            <div>
                                <small className="attribute-label">
                                    Choose a node type that meets your CPU, RAM, storage capacity, and drive type requirements.
                                    <a href={'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#rs-about-clusters-and-nodes'} target="_blank" rel="noopener noreferrer" Ò>
                                        See AWS node types documentation <i className="fas fa-external-link-alt"></i>
                                    </a>
                                </small>
                            </div>
                            <Select
                                value={nodeTypes ? nodeTypes.find(option => option.value === values.nodeType) : ''}
                                onChange={(option) => setFieldValue('nodeType', option.value)}
                                options={nodeTypes}
                            />
                            {touched.nodeType && errors.nodeType ? (
                                <div className="error-message">{errors.nodeType}</div>
                            ): null}
                        </Form.Group>

                        <Form.Group controlId="masterDatabaseName">
                            <Form.Label><b>Database Name</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="masterDatabaseName"
                                placeholder={"devdb"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.masterDatabaseName}
                                className={touched.masterDatabaseName && errors.masterDatabaseName ? "error" : null}
                            />
                            {touched.masterDatabaseName && errors.masterDatabaseName ? (
                                <div className="error-message">{errors.masterDatabaseName}</div>
                            ): null}
                        </Form.Group>
                        <Form.Group controlId="masterUsername">
                            <Form.Label><b>Master User</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="masterUsername"
                                placeholder={"dhuser"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.masterUsername}
                                className={touched.masterUsername && errors.masterUsername ? "error" : null}
                            />
                            {touched.masterUsername && errors.masterUsername ? (
                                <div className="error-message">{errors.masterUsername}</div>
                            ): null}
                        </Form.Group>
                        <Form.Group controlId="vpc">
                            <Form.Label><b>VPC</b></Form.Label>
                            <div>
                                <small className="attribute-label">
                                    The VPC must have at least one private subnet
                                </small>
                            </div>
                            <Form.Control
                                type="text"
                                name="vpc"
                                placeholder={"vpc-12345678012"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.vpc}
                                className={touched.vpc && errors.vpc ? "error" : null}
                            />
                            {touched.vpc && errors.vpc ? (
                                <div className="error-message">{errors.vpc}</div>
                            ): null}
                        </Form.Group>

                        <Row className={"mt-4"}>
                            <Col xs={3}><b></b>

                                <Button variant="success" type="submit" disabled={isSubmitting}>
                                    <b>Create</b>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </Background>
    </Container>
}

export default NewRedshiftCluster;
