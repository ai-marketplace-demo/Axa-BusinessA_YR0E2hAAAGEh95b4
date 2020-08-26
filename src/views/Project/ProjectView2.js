import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components";
import {toast} from "react-toastify";
import useClient from "../../api/client";
import getProject from "../../api/Project/getProject";
import ProjectOverview from "./ProjectOverview";
import ProjectDetails from "./ProjectDetails";
import ProjectContributorList from "./ProjectContributors/ProjectContributorList";
import NewProjectContributor from "./ProjectContributors/NewProjectContributor";
import ProjectDatasetList from "./ProjectDatasets/ProjectDatasetList";
import Datashopper from "./ProjectDatasets/Datashopper";
import ProjectTrustRelationshipList from "./ProjectTrustRelationships/ProjectTrustRelationshipList";
import NewProjectTrustRelationship from "./ProjectTrustRelationships/NewProjectTrustRelationship";
import ProjecTables from "./ProjectTables/ProjectTables";
import ProjectLocations  from "./ProjectLocations/ProjectLocations";
import ProjectNotebooks from "./ProjectNotebook/ProjectNotebooks";
import NewNotebook from "./ProjectNotebook/NewNotebook";
import ProjectPipelineList from "./ProjectPipelines/ProjectPipelineList";
import PipelineView from "./ProjectPipelines/ProjectPipelineView";
import ProjectPipelineLogs from "./ProjectPipelines/ProjectPipelineLogs";
import NewPipeline from "./ProjectPipelines/NewPipeline";
import ProjectPipelineScriptEditor from "./ProjectPipelines/ProjectPipelineScriptEditor";
import NewFolder from "./ProjectPipelines/NewFolder";

import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import Tag from "../../components/Tag/Tag";
import NewMLPipeline from "./ProjectMLPipelines/NewMLPipeline";
import ProjectMLPipelineList from "./ProjectMLPipelines/ProjectMLPipelineList";
import MLPipelineView from "./ProjectMLPipelines/ProjectMLPipelineView";
dayjs.extend(relativeTime);


const _FullScreen=styled.div`
position : fixed;
top : 1%;
z-index: 10;
width: 76%;
margin-left: 0%;
__border : 1px solid black;
background-color: white;
overflow-y: auto;
#height: 100vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}`


const FullScreen = styled.div`
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}\`

`
const ProjectView=(props)=>{
    let params= useParams();
    let client = useClient();
    let [project,setProject] = useState({});
    let [ready, setReady] = useState(false);

    useEffect(()=>{
        if (client){
            client
                .query(getProject(params.uri))
                .then((res)=>{
                    if (!res.errors){
                        setProject(res.data.getProject);
                        setReady(true);
                    }else {
                        toast.error(`Could not retrieve project, received ${res.errors[0].message}`,{hideProgressBar:true})
                    }
                })
                .catch((err)=>{
                    toast.error(`Unexpected error${err.message}`,{hideProgressBar:true})

                })
        }

    },[client]);

    if (!ready){
        return <Col>
            <Spinner variant={"primary"} animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </Col>

    }
    return <FullScreen>
        <Container>
            <Row className={"m-0 border-top border-bottom"}>
                <Col className="pt-3" xs={1}>
                    <Icon.Play size={32}/>
                </Col>
                <Col className={"border-right pt-1"} xs={8}>
                    <Row className={"m-0"}>
                        <Col xs={8}>
                            <h4>Project <b className={`text-primary`}>{project.label}</b></h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8}>
                        <p>Created by <a href={"#"}>{project.owner}</a> {dayjs(project.created).fromNow()} </p>
                        </Col>

                    </Row>

                </Col>
                <Col className={`border-right pt-1`} xs={2}>
                    Role in Project : <b className={`text-primary`}> {project.userRoleInProject}</b>
                </Col>

            </Row>
            <Row className={`mt-4`}>
                <Col xs={2}>
                    <Row>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/overview`}>Overview</Link>
                        </Col>
                    </Row>
                    <Row>
                    </Row>
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/details`}>Connect</Link>
                        </Col>
                    </Row>

                    {/**

                    <Row className={`mt-1`}>
                        <Col className={`text-left`} xs={11}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/datasets`}>Datasets</Link>
                        </Col>
                    </Row>
                    <Col xs={12}>
                        <Col xs={1}/>
                        <Col className={`text-left`} xs={11}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/tables`}>Tables</Link>
                        </Col>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={11}>
                        <Link style={{color:'black'}} to={`/project/${params.uri}/locations`}>Locations</Link>
                    </Col>
                     **/}

                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/notebooks`}>Notebooks</Link>
                        </Col>
                    </Row>
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/pipelines`}>SQL Pipelines</Link>
                        </Col>
                    </Row>
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/mlpipelines`}>ML Pipelines</Link>
                        </Col>
                    </Row>

                    {/**
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/project/${params.uri}/trusts`}>Integrations</Link>

                        </Col>
                    </Row>
                     **/}
                </Col>
                <Col xs={10}>
                    <Switch>
                        <Route path={`/project/:uri/newmlpipeline`}>
                            <NewMLPipeline project={project}/>
                        </Route>
                        <Route path={`/project/:uri/mlpipelines`}>
                            <ProjectMLPipelineList project={project}/>
                        </Route>
                        <Route path={`/project/:uri/mlpipeline/:mlPipelineUri`}>
                            <MLPipelineView project={project}/>
                        </Route>
                        <Route path={`/project/:uri/contributors`}>
                            <ProjectContributorList project={project}/>
                        </Route>
                        <Route path={`/project/:uri/newprojectcontributor`}>
                            <NewProjectContributor project={project}/>
                        </Route>
                        <Route path={`/project/:uri/details`}>
                           <ProjectDetails project={project}/>
                        </Route>
                        <Route path={`/project/:uri/tables`}>
                            <ProjecTables project={project}/>
                        </Route>
                        <Route path={`/project/:uri/locations`}>
                            <ProjectLocations project={project}/>
                        </Route>
                        <Route path={`/project/:uri/newpipeline`}>
                            <NewPipeline project={project}/>
                        </Route>
                        <Route path={`/project/:uri/pipelines`}>
                            <ProjectPipelineList project={project}/>
                        </Route>
                        <Route path={`/project/:uri/pipeline/:pipelineUri/logs`}>
                            <ProjectPipelineLogs project={project}/>
                        </Route>
                        <Route path={`/project/:uri/pipeline/:pipelineUri/newfolder`}>
                            <NewFolder project={project}/>
                        </Route>
                        <Route path={`/project/:uri/pipeline/:pipelineUri/file/:fileName`}>
                            <ProjectPipelineScriptEditor project={project}/>
                        </Route>
                        <Route path={`/project/:uri/pipeline/:pipelineUri`}>
                            <PipelineView project={project}/>
                        </Route>

                        <Route path={`/project/:uri/notebooks`}>
                            <ProjectNotebooks project={project}/>
                        </Route>
                        <Route path={`/project/:uri/newnotebook`}>
                            <NewNotebook project={project}/>
                        </Route>
                        <Route path={`/project/:uri/datasets`}>
                            <ProjectDatasetList project={project}/>
                        </Route>
                        <Route path={`/project/:uri/newprojectitem`}>
                            <Datashopper project={project}/>
                        </Route>
                        <Route path={`/project/:uri/trusts`}>
                            <ProjectTrustRelationshipList project={project}/>
                        </Route>
                        <Route path={`/project/:uri/newtrust`}>
                            <NewProjectTrustRelationship project={project}/>
                        </Route>
                        <Route path={`/project/:uri`}>
                          <ProjectOverview project={project}/>
                        </Route>


                    </Switch>
                </Col>
            </Row>
    </Container>
    </FullScreen>
}


export default ProjectView
