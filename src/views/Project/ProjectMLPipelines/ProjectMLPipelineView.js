import React, {useState, useEffect} from "react";
import {Row, Col, Container, Badge, Tabs, Tab, Spinner} from "react-bootstrap"
import {Link,useParams,useLocation} from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import Zoom from "../../../components/Zoomer/Zoom";
import useClient from "../../../api/client";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import {Else, If, Then} from "react-if";
import EnvironmentOverview from "../../EnvironmentPlayground/EnvironmentOverview";
import EnvironmentDatasets from "../../EnvironmentPlayground/EnvironmentDatasets";
import CodeRepository from "./details/CodeRepository";
import getProject from "../../../api/Project/getProject";
import {toast} from "react-toastify";
import getMLPipeline from "../../../api/Project/getMLPipeline";
import CICD from "./details/CICD";
import Workflow from "./details/Workflow";
import InfrastructureStack from "./details/InfrastructureStack";
dayjs.extend(relativeTime);

const MLPipelineView  = (props)=>{
    const  location = useLocation();
    let client = useClient();
    let params = useParams();

    let [project, setProject] = useState();
    let [pipeline, setPipeline] = useState();

    const [key, setKey] = useState('CodeRepository');

    useEffect(()=>{
        if (client){
            client
                .query(getProject(params.uri))
                .then((response)=>{
                    if (!response.errors){
                        setProject({...response.data.getProject});
                        console.log("project = ", project);
                    }else {
                        toast.error(`Could not retrieve project details, received ${response.errors[0].message}`)
                    }
                })
            client
                .query(getMLPipeline(params.mlPipelineUri))
                .then((response)=>{
                    if (!response.errors){
                        setPipeline({...response.data.getMLPipeline});
                        console.log("pipeline = ", pipeline);
                    }else {
                        toast.error(`Could not retrieve pipeline details, received ${response.errors[0].message}`)
                    }
                })
        }
    },[client])

    return <Container>
            <Row>
                <Col xs={12}>

                    <If condition={pipeline && project}>
                        <Then>
                            <Tabs
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                            >
                                <Tab eventKey="CodeRepository" title="Code Repository">
                                    <CodeRepository pipeline={pipeline} project={project}/>
                                </Tab>
                                <Tab eventKey="CICD" title="CI/CD">
                                    <CICD pipeline={pipeline} project={project}/>
                                </Tab>
                                <Tab eventKey="Workflow" title="ML Workflow">
                                    <Workflow pipeline={pipeline} project={project}/>
                                </Tab>
                                <Tab eventKey="Stack" title="Infrastructure Stack">
                                    <InfrastructureStack pipeline={pipeline} project={project}/>
                                </Tab>
                            </Tabs>
                        </Then>
                        <Else>
                            <Spinner variant={"primary"} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Else>
                    </If>
                </Col>
            </Row>
        </Container>
}

export default MLPipelineView;
