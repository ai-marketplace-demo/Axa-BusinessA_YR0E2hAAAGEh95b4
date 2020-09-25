import React ,{useEffect,useState} from "react";
import {Col, Badge,Row, Container, Spinner,Tabs,Tab} from "react-bootstrap";
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
    const [sqlPipeline, setSqlPipeline] = useState({})
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

    const OverviewTitle=()=>{

    }
    if (!sqlPipeline.sqlPipelineUri){
        return <Spinner variant={`primary`} border={`grow`}/>
    }

    return <FullScreen>
        <Container>
            <Row className={"m-0 border-top border-bottom"}>
                <Col className="pt-3" xs={1}>
                    <Icon.ArrowRepeat size={32}/>
                </Col>
                <Col className={"border-right pt-1"} xs={8}>
                    <Row className={"m-0"}>
                        <Col xs={8}>
                            <h4>SQL Pipeline <b className={`text-primary`}>{sqlPipeline.label}</b></h4>
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
                        <Badge pill variant={"primary"}>Owner</Badge>
                    </Col>
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
