import React ,{useEffect,useState} from "react";
import {Col,Row, Container, Spinner} from "react-bootstrap";
import Loader from 'react-loaders';
import {If, Then, Else,Switch,Case,Default} from "react-if";
import {useParams} from "react-router";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import useClient from "../../api/client";
import {toast} from "react-toastify";
import getSqlPipeline from "../../api/SqlPipeline/getSqlPipeline";
import getSqlPipelineCredsLinux from "../../api/SqlPipeline/getSqlPipelineCredsLinux";
import SqlPipelineOverview from "./SqlPipelineOverview";
import SqlPipelineStack from "./SqlPipelineStack";
import CodeBrowser from "./CodeBrowser/CodeBrowser";
import SqlPipelineRunList from "./Runs/SqlPipelineRunsList";
import SqlPipelineBuildList from "./Builds/SqlPipelineBuildsList";
import RoutedTabs from "../../components/Tabs/Tabs";
import ItemViewHeader from "../../components/ItemViewHeader/ItemViewHeader";


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
    const tabs=["overview","code","stack","builds", "executions"];
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
        return <Container>
            <Row>
                <Col style={{marginTop: '18%', marginLeft:'43%'}} xs={4}>
                    <Loader color={`lightblue`} type="ball-scale-multiple" />
                </Col>
            </Row>
        </Container>
    }

    return <FullScreen>
        <Container fluid className={`mt-3`}>
            <ItemViewHeader
                label={sqlPipeline.label}
                owner={sqlPipeline.owner}
                role={sqlPipeline.userRoleForPipeline}
                region={sqlPipeline.environment.region}
                status={sqlPipeline.stack ? sqlPipeline.stack.status : "NotFound"}
                created={sqlPipeline.created}
                itemIcon={<Icon.Gear size={32}/>}
            />
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
                                            <Spinner className={`mt-2`} animation={`border`} size={`sm`} variant={`info`}/>
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
                    <RoutedTabs
                    tabs={tabs}/>
                </Col>
            </Row>
            <Row className={`mt-4`}>
                <Col xs={12}>
                    <Switch>
                        <Case condition={params.tab=="code"}>
                            <CodeBrowser sqlPipeline={sqlPipeline}/>
                        </Case>
                        <Case condition={params.tab=="stack"}>
                            <SqlPipelineStack sqlPipeline={sqlPipeline}/>
                        </Case>
                        <Case condition={params.tab=="builds"}>
                            <SqlPipelineBuildList sqlPipeline={sqlPipeline}/>
                        </Case>
                        <Case condition={params.tab=="executions"}>
                            <SqlPipelineRunList sqlPipeline={sqlPipeline}/>
                        </Case>
                        <Default>
                            <SqlPipelineOverview sqlPipeline={sqlPipeline}/>
                        </Default>
                    </Switch>
                </Col>
            </Row>
            {/**
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
            **/}

        </Container>
    </FullScreen>
}


export default SqlPipelineAdmin ;
