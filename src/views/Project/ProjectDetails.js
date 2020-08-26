import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import useClient from "../../api/client";
import Zoom from "../../components/Zoomer/Zoom";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import getProject from "../../api/Project/getProject";
import getProjectConsoleUrl from "../../api/Project/getProjectConsoleUrl";
import getProjectCredentials from "../../api/Project/getProjectCredentials";

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



const ProjectDetails= (props)=>{
    let params = useParams();
    let client = useClient();
    const copy=(field)=>{
        toast(`Copied ${field} to clipboard`,{hideProgressBar:true});
    }

    let [details, setDetails] = useState();

    let [redirectUrl, setRedirectUrl] = useState('');
    let [fetchingUrl, setFetchingUrl] = useState(false);
    let [credentials, setCredentials] = useState(null);
    let [fetchingCredentials,setFetchinCredentials] = useState(false);

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

    useEffect(()=>{
        if (client){
            client
                .query(getProject(params.uri))
                .then((response)=>{
                    if (!response.errors){
                        setDetails({...response.data.getProject});
                        console.log("details = ", details);
                    }else {
                        toast.error(`Could not retrieve projet details, received ${response.errors[0].message}`)
                    }
                })
        }
    },[client])
    return <Container>
        {(!details?(
            <Spinner animation="grow" size="sm" />
        ):(
            <div>
            <Row>
                <Col xs={12}>
                    <h4>Details of project <b className={`text-primary`}>{details.label}</b>({details.projectUri})</h4>
                </Col>
            </Row>
            <DetailStyled>
            <Row>
            <Col xs={3}><b>AWS Account Id</b></Col>
            <Col xs={7}>
                <code>{details.environment.AwsAccountId}</code>
            </Col>
            <Col xs={2}>
                <Zoom color={"black"}>
                    <CopyToClipboard text={details.label}>
                        <Icon.Clipboard onClick={()=>{copy('AwsAccountId')}} className={`ml-2`}/>
                    </CopyToClipboard>
                </Zoom>
            </Col>

            </Row>
            <Row>
                <Col xs={3}><b>Project Bucket</b></Col>
                <Col xs={7}>
                    <code>{details.S3BucketName}</code>
                </Col>
                    <Col xs={2}>
                        <Zoom color={"black"}>
                            <CopyToClipboard text={details.S3BucketName}>
                                <Icon.Clipboard onClick={()=>{copy('S3BucketName')}} className={`ml-2`}/>
                            </CopyToClipboard>
                        </Zoom>
                    </Col>
            </Row>
                <Row>
                    <Col xs={3}><b>Project Region</b></Col>
                    <Col xs={7}>
                        <code>{details.region}</code>
                    </Col>
                    <Col xs={2}>
                        <Zoom color={"black"}>
                            <CopyToClipboard text={details.region}>
                                <Icon.Clipboard onClick={()=>{copy('region')}} className={`ml-2`}/>
                            </CopyToClipboard>
                        </Zoom>
                    </Col>
                </Row>
            <Row>
                <Col xs={3}><b>Project Database</b></Col>
                <Col xs={7}>
                    <code>{details.GlueDatabaseName}</code>
                </Col>
                <Col xs={2}>
                    <Zoom color={"black"}>
                        <CopyToClipboard text={details.GlueDatabaseName}>
                            <Icon.Clipboard onClick={()=>{copy('GlueDatabaseName')}} className={`ml-2`}/>
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>

            <Row>
                <Col xs={3}><b>Project Role </b></Col>
                <Col xs={7}>
                    <code>arn:aws:iam::{details.environment.AwsAccountId}:role/{details.IAMRoleName}</code>
                </Col>
                <Col xs={2}>
                    <Zoom color={"black"}>
                        <CopyToClipboard text={`arn:aws:iam::${details.environment.AwsAccountId}:role/${details.IAMRoleName}`}>
                            <Icon.Clipboard onClick={()=>{copy('IAMRoleName')}} className={`ml-2`}/>
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>
            <Row className={`mt-2`}>
                <Col xs={3}><b>Console Access</b></Col>
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
                    <Col xs={3}><b>Credentials</b></Col>
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


export default ProjectDetails;
