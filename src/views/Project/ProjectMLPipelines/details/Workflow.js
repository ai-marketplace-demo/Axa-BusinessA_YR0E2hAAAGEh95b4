import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import useClient from "../../../../api/client";
import Zoom from "../../../../components/Zoomer/Zoom";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import getProjectConsoleUrl from "../../../../api/Project/getProjectConsoleUrl";
import getProjectCredentials from "../../../../api/Project/getProjectCredentials";
import getProject from "../../../../api/Project/getProject";
import getMLPipeline from "../../../../api/Project/getMLPipeline";

const _DetailStyled=styled.div`
height: 15rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`

const DetailStyled=styled.div`
height:100vh;
`



const Workflow= (props)=>{
    let client = useClient();
    const copy=(field)=>{
        toast(`Copied ${field} to clipboard`,{hideProgressBar:true});
    }

    let [redirectUrl, setRedirectUrl] = useState('');
    let [fetchingUrl, setFetchingUrl] = useState(false);
    let [credentials, setCredentials] = useState(null);
    let [fetchingCredentials,setFetchinCredentials] = useState(false);

    let project = props.project;
    let pipeline = props.pipeline;

    const redirect=async ()=>{
        setFetchingUrl(true);
        const response= await client.query(getProjectConsoleUrl(props.project.projectUri));
        if (!response.errors){
            console.log('> > >',response.data.getProjectConsoleUrl)
            setRedirectUrl(response.data.getProjectConsoleAccess);

        }else {
            toast.error(`could not retieve url, received ${response.errors[0].message}`)
        }
        setFetchingUrl(false);
    }

    const fetchCredentials=async ()=>{
        setFetchinCredentials(true);
        const response= await client.query(getProjectCredentials(props.project.projectUri));
        if (!response.errors){
            setCredentials(response.data.getProjectCredentials);

        }else {
            toast.error(`could not retieve url, received ${response.errors[0].message}`)
        }
        setFetchinCredentials(false);
    }

    return <Container>
        {(!project || !pipeline ?(
            <Spinner animation="grow" size="sm" />
        ):(
            <div>
                <Row className={`mt-4`}>
                    <Col xs={9}>
                    <h5>Step Functions Details</h5>
                </Col>
                <Col xs={3}>
                    <b>Status : {pipeline.workflowManagerStatus}</b>
                </Col>
            </Row>
            <DetailStyled>
            <Row>
            <Col xs={4}><b>AWS Account</b></Col>
            <Col xs={7}>
                <code>{project.environment.AwsAccountId}</code>
            </Col>
            <Col xs={1}>
                <Zoom color={"black"}>
                    <CopyToClipboard text={project.label}>
                        <Icon.Clipboard onClick={()=>{copy('AWS Account')}} className={`ml-2`}/>
                    </CopyToClipboard>
                </Zoom>
            </Col>

            </Row>
                <Row>
                    <Col xs={4}><b>Schedule Expression</b></Col>
                    <Col xs={7}>
                        <code>{pipeline.scheduleExpression}</code>
                    </Col>
                </Row>
            <Row>
                <Col xs={4}><b>Workflow Manager Name</b></Col>
                <Col xs={7}>
                    <code>{pipeline.workflowManagerName}</code>
                </Col>
                    <Col xs={1}>
                        <Zoom color={"black"}>
                            <CopyToClipboard text={pipeline.workflowManagerName}>
                                <Icon.Clipboard onClick={()=>{copy('Workflow Manager Name')}} className={`ml-2`}/>
                            </CopyToClipboard>
                        </Zoom>
                    </Col>
            </Row>
            <Row>
                <Col xs={4}><b>Workflow ARN</b></Col>
                <Col xs={7}>
                    <code>{pipeline.workflowManagerArn}</code>
                </Col>
                <Col xs={1}>
                    <Zoom color={"black"}>
                        <CopyToClipboard text={pipeline.workflowManagerArn}>
                            <Icon.Clipboard onClick={()=>{copy('Workflow Manager Arn')}} className={`ml-2`}/>
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>
                <Row>
                    <Col xs={4}><b>Jobs Manager Name</b></Col>
                    <Col xs={7}>
                        <code>{pipeline.jobManagerName}</code>
                    </Col>
                    <Col xs={1}>
                        <Zoom color={"black"}>
                            <CopyToClipboard text={pipeline.jobManagerName}>
                                <Icon.Clipboard onClick={()=>{copy('Jobs Manager Name')}} className={`ml-2`}/>
                            </CopyToClipboard>
                        </Zoom>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}><b>Jobs Manager Arn</b></Col>
                    <Col xs={7}>
                        <code>{pipeline.jobManagerArn}</code>
                    </Col>
                    <Col xs={1}>
                        <Zoom color={"black"}>
                            <CopyToClipboard text={pipeline.jobManagerArn}>
                                <Icon.Clipboard onClick={()=>{copy('Jobs Manager Arn')}} className={`ml-2`}/>
                            </CopyToClipboard>
                        </Zoom>
                    </Col>
                </Row>
            <Row className={`mt-2`}>
                <Col xs={4}><b>Console Access</b></Col>
                <Col xs={3}>
                    <div style={{width:'100%'}} onClick={redirect} className={"btn-sm btn btn-primary"}>Generate Url</div>
                </Col>
                <Col xs={3}/>
                <Col xs={3}>
                {(redirectUrl)?(
                    <a target="_blank" href={redirectUrl}>
                        <Icon.Arrow90degRight/> Jump to console</a>
                ):(
                    (fetchingUrl)?(
                        <Spinner size="sm" animation="grow" variant='primary' role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    ):(<div/>)
                )}
                </Col>
            </Row>
                <Row className={`mt-2`}>
                    <Col xs={4}><b>Credentials</b></Col>
                    <Col xs={3}>
                        <div style={{width:'100%'}}  onClick={fetchCredentials} className={"btn-sm btn btn-primary"}>Generate Token</div>
                    </Col>
                    <Col xs={3}/>
                    <Col xs={3}>
                        {(credentials)?(
                            <Zoom color={"black"}>
                                <CopyToClipboard text={credentials}>
                                    <Icon.Clipboard onClick={()=>{copy('Credentials')}} className={`ml-2`}/>
                                </CopyToClipboard>
                            </Zoom>

                        ):(
                            (fetchingCredentials)?(
                                <Spinner size="sm" animation="grow" variant='primary'/>
                            ):(<div/>)
                        )}
                    </Col>
                </Row>
            </DetailStyled>
            </div>


            ))}
    </Container>
}


export default Workflow;
