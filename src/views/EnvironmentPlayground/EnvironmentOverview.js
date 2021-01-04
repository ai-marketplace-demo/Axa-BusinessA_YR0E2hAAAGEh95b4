import React, { useEffect, useState} from "react"
import {Link} from "react-router-dom";
import {If, Then,Else, Switch, Case,Default} from "react-if";
import styled from "styled-components";
import {Container, Row, Col,Spinner} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Zoom from "../../components/Zoomer/Zoom";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import useClient from "../../api/client";
import generateEnvironmentAccessToken from "../../api/Environment/generateEnvironmentAccessToken";
import getEnvironmentAssumeRoleUrl from "../../api/Environment/getEnvironmentAssumeRoleUrl";
import getDatasetAdminConsoleUrl from "../../api/Dataset/getDatasetAdminConsoleUrl";
import {toast} from "react-toastify";
import generateDatasetAccessToken from "../../api/Dataset/generateDatasetAccessToken";


const Styled=styled.div`
padding-left: 4ch;
padding-top:2ch;
width:80%;
height: 100vh;

`

const EnvironmentOverview = (props)=>{
    const env = props.environment;
    let client = useClient();
    let [credentials,setCredentials]=useState(null);
    let [consoleUrl,setConsoleUrl]=useState(null);
    let [isLoadingConsoleUrl,setIsLoadingConsoleUrl] = useState(false);
    let [isLoadingCredentials,setIsLoadingCredentials] = useState(false);

    const generateCredentials=async ()=>{
        setIsLoadingCredentials(true);
        const response = await client.query(generateEnvironmentAccessToken({environmentUri: env.environmentUri}));

        if (!response.errors){
            setCredentials(response.data.generateEnvironmentAccessToken)
        }else{
            toast(`Could not retrieve Acces Token, received ${response.errors[0].message}`)
        }
        setIsLoadingCredentials(false);

    }
    const generateRedirectUrl =async ()=>{
        setIsLoadingConsoleUrl(true);
        const response = await client.query(getEnvironmentAssumeRoleUrl({environmentUri:env.environmentUri}));

        if (!response.errors){
            setConsoleUrl(response.data.getEnvironmentAssumeRoleUrl)
        }else{
            toast(`Could not retrieve URL , received ${response.errors[0].message}`)
        }
        setIsLoadingConsoleUrl(false);

    }

    const copy=(field)=>{
        toast(`Copied ${field} to clipboard`,{hideProgressBar:true});
    }
    useEffect(()=>{},[client])

    return <Container className={`mt-1`}>
        <Row>
            <Col xs={10}>
                <h4><Icon.InfoSquare/> Environment Overview</h4>
            </Col>
        </Row>
        <Styled>
            <Row >
                <Col xs={4}><b>Organization</b></Col>
                <Col xs={8}>
                    {env.organization.name}
                </Col>
            </Row>
            <Row >
                <Col xs={4}><b>Saml Group</b></Col>
                <Col xs={8}>
                    {env.SamlGroupName}
                </Col>
            </Row>

            <Row >
                <Col xs={4}><b>Name</b></Col>
                <Col xs={8}>
                    {env.name}
                </Col>
            </Row>
            <Row>
                <Col xs={4}><b>Aws</b></Col>
                <Col xs={8}>{env.AwsAccountId}</Col>
            </Row>
            <Row>
                <Col xs={4}><b>Region</b></Col>
                <Col xs={8}>{env.region}</Col>
            </Row>
            <Row>
                <Col xs={4}><b>Admin</b></Col>
                <Col xs={8}>{env.owner}</Col>
            </Row>
            <If condition={env.userRoleInEnvironment!='NotInvited'}>
                <Then>
                    <Row className={`mt-2`}>
                        <Col className={`mt-2 border-bottom`} xs={10}></Col>
                    </Row>
                    <Row className={`mt-4`}>
                        <Col xs={4}>
                            <b>Session Token</b>
                        </Col>
                        <Col xs={4}>
                            <div onClick={generateCredentials} style={{width:'100%'}} className={`btn-sm btn btn-info`}>Generate Temporary Credentials</div>
                        </Col>
                        <Col className={`pt-2`} xs={4}>
                            <Switch>
                                <Case condition={isLoadingCredentials}>
                                    <Spinner size={`sm`}  animation={`border`} variant={`info`}/>
                                </Case>
                                <Case condition={credentials!==null}>
                                    <CopyToClipboard text={credentials}>
                                        <Icon.Clipboard onClick={()=>{copy('Credentials')}} className={`ml-2`}/>
                                    </CopyToClipboard>
                                </Case>
                                <Default>
                                    <div/>
                                </Default>

                            </Switch>
                        </Col>
                    </Row>
                    <Row className={`mt-1`}>
                        <Col xs={4}>
                            <b>Console Access</b>
                        </Col>
                        <Col xs={4}>
                            <div onClick={generateRedirectUrl} style={{width:'100%'}}  className={`btn-sm btn btn-info`}>Generate Url</div>
                        </Col>
                        <Col xs={4}>
                            <Switch>
                                <Case condition={isLoadingConsoleUrl}>
                                    <Spinner size={`sm`}  variant={`info`} animation={`border`}/>
                                </Case>
                                <Case condition={consoleUrl!==null}>
                                    <a target={`_blank`} href ={consoleUrl}>
                                        <Icon.Arrow90degRight/> AWS Console
                                    </a>
                                </Case>
                                <Default>
                                    <div/>
                                </Default>
                            </Switch>
                        </Col>
                    </Row>

                </Then>
            </If>

        </Styled>
    </Container>
}


export default EnvironmentOverview;
