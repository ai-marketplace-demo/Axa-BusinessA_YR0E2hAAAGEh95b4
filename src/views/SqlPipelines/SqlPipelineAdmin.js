import React ,{useEffect,useState} from "react";
import {Col, Badge,Row, Container, Spinner,Tabs,Tab} from "react-bootstrap";
import Loader from 'react-loaders';
import {If, Then, Else} from "react-if";
import {useParams, useHistory} from "react-router";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import MainActionButton from "../../components/MainActionButton/MainButton";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import getSqlPipeline from "../../api/SqlPipeline/getSqlPipeline";
import getSqlPipelineCredsLinux from "../../api/SqlPipeline/getSqlPipelineCredsLinux";
import SqlPipelineOverview from "./SqlPipelineOverview";
import SqlPipelineStack from "./SqlPipelineStack";
import CodeBrowser from "./CodeBrowser/CodeBrowser";
import SqlPipelineRunList from "./Runs/SqlPipelineRunsList";
import SqlPipelineBuildList from "./Builds/SqlPipelineBuildsList";


const FullScreen = styled.div`
height: 120vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}\`

`

const SqlPipelineAdmin = (props)=>{
    const client = useClient()
    const params = useParams();
    const [ready,setReady]= useState(false);
    const [key, setKey] = useState("Overview");
    const [sqlPipeline, setSqlPipeline] = useState({});
    const [displayGitInstructions, setDisplayGitInstructions] = useState(false);
    const [creds, setCreds] = useState("");
    const [isLoadingCreds, setIsLoadingCreds]= useState(false);
    useEffect(()=>{
        if (client){
            client
                .query(getSqlPipeline(params.uri))
                .then((res)=>{
                    if (!res.errors){
                        setSqlPipeline(res.data.getSqlPipeline);
                        setReady(true);
                    }else {
                        toast.error(`Could not retrieve sqlPipeline, received ${res.errors[0].message}`,{hideProgressBar:true})
                    }
                })
                .catch((err)=>{
                    toast.error(`Unexpected error${err.message}`,{hideProgressBar:true})

                })
        }

    },[client]);

    const getExports=(c)=>{
        const tmp_credentials = JSON.parse(c);
        return [
            `export AWS_ACCESS_KEY_ID="${tmp_credentials.AWS_ACCESS_KEY_ID}"`,
            `export AWS_SECRET_ACCESS_KEY="${tmp_credentials.AWS_SECRET_ACCESS_KEY}"`,
            `export AWS_SESSION_TOKEN="${tmp_credentials.AWS_SESSION_TOKEN}"`,
            `git clone codecommit::${sqlPipeline.environment.region}://${sqlPipeline.repo}`
        ]
    }

    const getAwsCreds=async()=>{
        setIsLoadingCreds(true)
        const response = await client.query(getSqlPipelineCredsLinux(sqlPipeline.sqlPipelineUri));
        if (!response.errors){
            setCreds(response.data.getSqlPipelineCredsLinux);
            setIsLoadingCreds(false);
            setDisplayGitInstructions(true);
        }
    }



    if (!ready){
        return <Container className={`mt-2`}>
            <Row>
                <Col style={{marginTop: '3%', marginLeft:'3%'}} xs={4}>
                    <Loader color={`lightblue`} type="ball-scale-multiple" />
                </Col>
            </Row>
        </Container>
    }

    return <FullScreen>
        <Container fluid className={`mt-3`}>
            <Row style={{
                borderBottom:'1px lightgrey solid',
                borderRight:'1px lightgrey solid',
                borderBottomRightRadius:"23px",
                boxShadow:'3px 4px 4px lightgrey',
            }}
                 className={"mt-3    "}>

                <Col className="pt-3" xs={1}>
                    <Icon.Gear size={32}/>
                </Col>
                <Col className={"border-right pt-1"} xs={8}>
                    <Row className={"m-0"}>
                        <Col xs={8}>
                            <h4>Data Pipeline <b className={`text-primary`}>{sqlPipeline.label}</b></h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8}>
                            <p>Created by <a href={"#"}>{sqlPipeline.owner}</a> {dayjs(sqlPipeline.created).fromNow()} </p>
                        </Col>

                    </Row>

                </Col>
                <Col className={`border-right pt-1`} xs={2}>
                    <Row>
                        <Col xs={12}>
                    Role in SqlPipeline : <b className={`text-primary`}> {sqlPipeline.userRoleInSqlPipeline}</b>
                        </Col>
                    </Row>
                    <Col xs={12} className={`mt-2`}>
                        <Badge pill variant={"info"}>Owner</Badge>
                    </Col>
                </Col>

            </Row>
            <Row>
                <Col xs={12}>
                    <If condition={displayGitInstructions}>
                        <Then>
                                <Row>
                                    <Col xs={10}/>
                                    <Col xs={2}>
                                        <div onClick={()=>{setDisplayGitInstructions(false)}}>close</div>
                                    </Col>
                                </Row>
                                <Row className={`text-dark`}>
                                    <Col xs={10}>
                                        {creds&&getExports(creds).map((l)=>{
                                            return <Row><Col xs={12}><div style={{fontFamily:'Courier New',fontSize:'8px'}}>{l}</div></Col></Row>
                                        })}
                                    </Col>
                                </Row>
                        </Then>
                        <Else>
                            <Row>

                                <Col xs={12}>
                                    <If condition={isLoadingCreds}>
                                        <Then>
                                            <Spinner className={`mt-2`} animation={`border`} size={`sm`} variant={`primary`}/>
                                        </Then>
                                        <Else>
                                            <div className={`mt-2 text-primary`} onClick={()=>{getAwsCreds()}}> See git instructions</div>
                                        </Else>
                                    </If>
                                </Col>
                            </Row>
                        </Else>
                    </If>
                </Col>
            </Row>

            <Row className={`mt-4`}>
                <Col xs={12}>
                    <Tabs
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                    >
                        <Tab eventKey="Overview" title={'Overview'}>
                          <SqlPipelineOverview sqlPipeline={sqlPipeline}/>
                        </Tab>

                        <Tab eventKey="Code" title="Code">
                           <CodeBrowser sqlPipeline={sqlPipeline}/>
                        </Tab>
                        <Tab eventKey="Stack" title="Stack">
                            <SqlPipelineStack sqlPipeline={sqlPipeline}/>
                        </Tab>

                        <Tab eventKey="Builds" title="Builds">
                            <If condition={key=="Builds"}>
                                <Then>
                                    <SqlPipelineBuildList sqlPipeline={sqlPipeline}/>
                                </Then>
                            </If>
                        </Tab>
                        <Tab eventKey="Executions" title="Executions">
                            <If condition={key=="Executions"}>
                                <Then>
                                    <SqlPipelineRunList sqlPipeline={sqlPipeline}/>
                                </Then>
                            </If>
                        </Tab>

                    </Tabs>

                </Col>
            </Row>

        </Container>
    </FullScreen>
}


export default SqlPipelineAdmin ;
