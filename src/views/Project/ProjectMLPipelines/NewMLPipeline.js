import React, {useState, useEffect} from "react";
import {Container, Row, Col, Spinner, Form, Button} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import styled from "styled-components";
import * as Icon from "react-bootstrap-icons";
import useClient from "../../../api/client";
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {toast} from"react-toastify"
import createProjectMLPipeline from "../../../api/Project/createMLPipeline";
import {If, Then} from "react-if";



const Background=styled.div`
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


const NewMLPipeline= (props)=>{
    let history = useHistory();
    let client=useClient();
    let [submitting, setSubmitting] = useState(false);
    const validationSchema = Yup.object().shape({
        label: Yup.string()
            .min(2, "*Pipeline name must have at least 2 characters")
            .max(100, "*Pipeline name can't be longer than 100 characters")
            .required("*Pipeline name is required"),
        monitoringEmail: Yup.string()
            .email("*Must be a valid email address")
            .max(100, "*Email must be less than 100 characters")
            .required("*Email is required"),
        packageName: Yup.string()
            .matches("^[a-zA-Z_0-9]*$", "*Python package name is not valid")
            .min(2, "*Python package name must have at least 2 characters")
            .max(60, "*Python package name can't be longer than 60 characters")
            .required("*Python package name required"),
        subnetId: Yup.string()
            .matches("subnet-*", "*Subnet Id is not valid")
            .required("*Subnet Id is required"),
        securityGroupId: Yup.string()
            .matches("sg-*", "*Security Group Id is not valid")
            .required("*Security Group Id is required"),
        scheduleExpression: Yup.string()
            .required("*Schedule expression is required"),
    });


    const submitForm=async (formData)=>{
        setSubmitting(true);
        const response = await client.mutate(createProjectMLPipeline({
            projectUri : props.project.projectUri,
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
    }

    useEffect(()=>{
    },[client])

    return <Container>
        <Row>
            <Col xs={2}>
                <Link style={{color:'black'}} to={`/project/${props.project.projectUri}/mlpipelines`}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={10}>

                <h4> New Machine Learning Pipeline</h4>
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
                initialValues={{
                    label: "",
                    packageName: "",
                    subnetId: "", //"subnet-03ce2af356a80d1f0",
                    securityGroupId: "", // "sg-0584c843c1a9162b2",
                    scheduleExpression: "", //"0 4 * * ? *",
                    monitoringEmail: ""
                }}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    submitForm(values)
                }}
            >
                {/* Callback function containing Formik state and helpers that handle common form actions */}
                {( {values,
                       errors,
                       touched,
                       handleChange,
                       handleBlur,
                       handleSubmit,
                       isSubmitting }) => (

                    <Form onSubmit={handleSubmit} className="mx-auto">
                        {console.log(values)}
                        <Form.Group controlId="label">
                            <Form.Label><b>Pipeline name</b></Form.Label>
                            <Form.Control
                                type="text"
                                /* This name property is used to access the value of the form element via values.nameOfElement */
                                name="label"
                                placeholder="Pipeline name"
                                /* Set onChange to handleChange */
                                onChange={handleChange}
                                /* Set onBlur to handleBlur */
                                onBlur={handleBlur}
                                /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                                value={values.label}
                                /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                                className={touched.label && errors.label ? "error" : null}
                            />
                            {/* Applies the proper error message from validateSchema when the user has clicked the element and there is an error, also applies the .error-message CSS class for styling */}
                            {touched.label && errors.label ? (
                                <div className="error-message">{errors.label}</div>
                            ): null}
                        </Form.Group>

                        <Form.Group controlId="packageName">
                            <Form.Label><b>Python Package Name</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="packageName"
                                placeholder="Python package name ( PEP8 standards )"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.packageName}
                                className={touched.packageName && errors.packageName ? "error" : null}
                            />
                            {touched.packageName && errors.packageName ? (
                                <div className="error-message">{errors.packageName}</div>
                            ): null}
                        </Form.Group>
                        <Form.Group controlId="scheduleExpression">
                            <Form.Label><b>Schedule Expression</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="scheduleExpression"
                                placeholder={"Schedule ML Pipeline execution.\"0 4 * * ? *\" will run the workflow everyday at 4:00 UTC."}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.scheduleExpression}
                                className={touched.scheduleExpression && errors.scheduleExpression ? "error" : null}
                            />
                            {touched.scheduleExpression && errors.scheduleExpression ? (
                                <div className="error-message">{errors.scheduleExpression}</div>
                            ): null}
                        </Form.Group>
                        <Form.Group controlId="subnetId">
                            <Form.Label><b>AWS Subnet Id</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="subnetId"
                                placeholder={"Subnet where SageMaker jobs will run (e.g subnet-06e2f2507)"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.subnetId}
                                className={touched.subnetId && errors.subnetId ? "error" : null}
                            />
                            {touched.subnetId && errors.subnetId ? (
                                <div className="error-message">{errors.subnetId}</div>
                            ): null}
                        </Form.Group>
                        <Form.Group controlId="securityGroupId">
                            <Form.Label><b>AWS Security Group</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="securityGroupId"
                                placeholder={"SG that SageMaker jobs will use (e.g sg-088628f6)"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.securityGroupId}
                                className={touched.securityGroupId && errors.securityGroupId ? "error" : null}
                            />
                            {touched.securityGroupId && errors.securityGroupId ? (
                                <div className="error-message">{errors.securityGroupId}</div>
                            ): null}
                        </Form.Group>
                        <Form.Group controlId="monitoringEmail">
                            <Form.Label><b>Monitoring Email</b></Form.Label>
                            <Form.Control
                                type="email"
                                name="monitoringEmail"
                                placeholder={"Email for monitoring notifications"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.monitoringEmail}
                                className={touched.monitoringEmail && errors.monitoringEmail ? "error" : null}
                            />
                            {touched.monitoringEmail && errors.monitoringEmail ? (
                                <div className="error-message">{errors.monitoringEmail}</div>
                            ): null}
                        </Form.Group>
                        <Row className={"mt-4"}>
                            <Col xs={3}><b></b>

                                <Button variant="success" type="submit" disabled={isSubmitting}>
                                    <b>Create Pipeline</b>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </Background>
    </Container>
}

export default NewMLPipeline;
