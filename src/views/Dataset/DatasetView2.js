import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Tabs, Col, Badge, Tab} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import { If, Then, Else, When, Unless, Case, Default } from 'react-if';
import styled from "styled-components"
import Tag from "../../components/Tag/Tag";
import useClient from "../../api/client";
import getDataset from "../../api/Dataset/getDataset";
import DatasetOverview from "./DatasetOverview";
import DatasetDetails from "./DatasetDetails";
import DatasetContributorList from "./DatasetContributors/DatasetContributorList";
import NewDatasetContributor from "./DatasetContributors/NewDatasetContributor";
import NewDatasetSharee from "./DatasetSharing/NewDatasetSharee";
import ShareObjectList from "./ShareObjects/ShareObjectList2";
import ShareObjectView from "./ShareObjects/ShareObjectView";
import NewShareObjectForm from "./ShareObjects/NewShareObjectForm3";
import NewShareItemForm from "./ShareObjects/NewShareItemForm";
import DatasetLoaderList from "./DatasetLoaders/DatasetLoaderList";
import NewDatasetLoader from "./DatasetLoaders/NewDatasetLoader";
import DatasetSummary from "./DatasetSummary/DatasetSummary";
import DatasetCustomTagEditor from "./DatasetCustomTags/DatasetCustomTagsEditor";


import StorageLocationList from "./DatasetStorageLocations/StorageLocationList";
import NewLocationForm from "./DatasetStorageLocations/NewLocation";
import StorageLocationPermissionList from "./DatasetStorageLocations/StorageLocationPermissionList";
import NewLocationPermission from "./DatasetStorageLocations/NewLocationPermission";

import TableList from "./DatasetTables/TableList";
import NewTable from "./DatasetTables/NewTable";
import TablePermissionList from "./DatasetTables/TablePermissionList";
import NewTablePermission from "./DatasetTables/NewTablePermission";


import  DatasetQualityRulesList from "./DatasetQualityRules/DatasetQualityRulesList";
import  NewDatasetQualityRule from "./DatasetQualityRules/NewDatasetQualityRule";
import  EditDatasetQualityRule from "./DatasetQualityRules/EditDatasetQualityRule";
import SqlPipelineOverview from "../SqlPipelines/SqlPipelineOverview";
import DatasetShareeList from "./DatasetSharing/DatasetShareeList";


const _FullScreen=styled.div`
position : fixed;
top : 1%;
z-index: 10;
width: 100%;
margin-left: 0%;
border : 1px solid black;
background-color: white;
overflow-y: hidden; 
overflow-y: auto; 
height: 200vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}
`

const FullScreenBack=styled.div`
position : fixed;
top : 1%;
z-index: 10;
width: 76%;
margin-left: 0%;
__border : 1px solid black;
background-color: white;
overflow-y: auto;
height: 100vh;
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

`

const DatasetView=(props)=>{
    let params= useParams();
    console.log(params);
    let client = useClient();
    let [info,setInfo] = useState({});
    let [canEdit, setCanEdit] = useState(false);
    let [ready, setReady] = useState(false);
    useEffect(()=>{
        if (client){
            client
                .query(getDataset(params.uri))
                .then((res)=>{
                    if (!res.errors){
                        setInfo(res.data.getDataset);
                        setReady(true);
                        setCanEdit(['Creator','Admin'].indexOf(res.data.getDataset.userRoleForDataset)!=-1)
                    }
                });
        }
    },[client]);

    const [key, setKey] = useState("overview");
    if (!ready){
        return <Col>
            <Spinner variant={"primary"} animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </Col>

    }
    return <FullScreen>
        <Container>
            {/**
            <Row className={"mt-2 pt-4 border-top border-bottom"}>
                <Col xs={12}>
                    <Tabs
                        className={`mb-2`}
                    activeKey={key}
                    onSelect={(k)=>{setKey(k)}}
                    >
                        <Tab eventKey="overview" title={'Overview'}>
                            <DatasetOverview dataset={info}/>
                        </Tab>
                        <Tab eventKey="summary" title={'Summary'}>
                            <DatasetSummary dataset={info}/>
                        </Tab>
                        <Tab eventKey={'tags'} title={`Tags`}>
                            <DatasetCustomTagEditor dataset={info}/>
                        </Tab>
                        <Tab eventKey={'connect'} title={`Connect`}>
                            <DatasetDetails dataset={info}/>
                        </Tab>
                        <Tab eventKey={'shares'} title={`Shares`}>
                            <ShareObjectList dataset={info}/>
                        </Tab>
                        <Tab eventKey={'folders'} title={`Folders`}>
                            <StorageLocationList dataset={info}/>
                        </Tab>

                    </Tabs>
                </Col>
            </Row>
            **/}
            <Row className={"m-0 border-top border-bottom"}>
                        <Col className="pt-4" xs={1}>
                            <Icon.Folder size={32}/>
                        </Col>
                        <Col className={`border-right pt-3`} xs={4}>
                            <Row>
                                <h4>{info.label}</h4>
                            </Row>
                            <Row>
                                <p>by <a href={"#"}>{info.owner}</a></p>
                            </Row>

                        </Col>
                        <Col className={`border-right pt-3`} xs={2}>
                            Role for dataset : <b className={`text-primary`}>{info.userRoleForDataset}</b>
                        </Col>
            </Row>
            <Row className={`ml-0 mt-4`}>
                <Col xs={2}>
                    <Row>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/overview`}>Overview</Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/custom-tags`}>Metadata</Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/summary`}>Summary</Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/summary`}>Stack</Link>
                        </Col>
                    </Row>
                    <If condition={canEdit}>
                        <Then>
                            <Row className={`mt-1`}>
                                <Col xs={12}>
                                    <Link style={{color:'black'}} to={`/dataset/${params.uri}/details`}>Connect</Link>
                                </Col>
                            </Row>
                        </Then>
                    </If>
                    {/**
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/contributors`}>Contributors</Link>
                        </Col>
                    </Row>
                     **/}
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/shares`}>Access Requests</Link>
                        </Col>
                    </Row>
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/locations`}>Storage Locations</Link>
                        </Col>
                    </Row>
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/tables`}>Tables</Link>
                        </Col>
                    </Row>
                    {/**
                    <Row className={`mt-1`}>
                        <Col xs={12}>Queries</Col>
                    </Row>
                     **/}
                     <If condition={canEdit}>
                         <Then>
                             <Row className={`mt-1`}>
                                 <Col xs={12}>
                                     <Link style={{color:'black'}} to={`/dataset/${params.uri}/loaders`}>Integrations</Link>
                                 </Col>
                             </Row>
                         </Then>
                     </If>

                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/data-quality-rules`}>
                                Data Quality
                            </Link>
                        </Col>
                    </Row>
                </Col>
                <Col xs={10}>
                    <Switch>
                        <Route path={`/dataset/:uri/overview`}>
                            <DatasetOverview dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/data-quality-rules`}>
                            <DatasetQualityRulesList dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/dataset-quality-rule/:ruleUri`}>
                            <EditDatasetQualityRule dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/new-data-quality-rule`}>
                            <NewDatasetQualityRule dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/custom-tags`}>
                            <DatasetCustomTagEditor dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/summary`}>
                            <DatasetSummary dataset={info}/>
                        </Route>

                        <Route path={`/dataset/:uri/details`}>
                           <DatasetDetails dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/shares`}>
                            <ShareObjectList dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/share/:shareuri/newitem`}>
                            <NewShareItemForm dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/share/:shareuri`}>
                            <ShareObjectView dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/newshareobject`}>
                            <NewShareObjectForm dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/newdatasetshare`}>
                            <NewDatasetSharee dataset={info}/>
                        </Route>

                        <Route path={`/dataset/:uri/contributors`}>
                            <DatasetContributorList  dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/newdatasetcontributor`}>
                            <NewDatasetContributor dataset={info}/>
                        </Route>

                        <Route path={`/dataset/:uri/loaders`}>
                            <DatasetLoaderList dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/newloader`}>
                            <NewDatasetLoader dataset={info}/>
                        </Route>

                        <Route path={`/dataset/:uri/locations`}>
                            <StorageLocationList dataset={info}/>
                        </Route>

                        <Route path={`/dataset/:datasetUri/permissions/storage/:locationUri/new`}>
                            <NewLocationPermission dataset={info}/>
                        </Route>

                        <Route path={`/dataset/:datasetUri/permissions/storage/:locationUri`}>
                            <StorageLocationPermissionList/>
                        </Route>


                        <Route path={`/dataset/:datasetUri/permissions/table/:tableUri/new`}>
                            <NewTablePermission dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:datasetUri/permissions/table/:tableUri`}>
                            <TablePermissionList/>
                        </Route>

                        <Route path={`/dataset/:uri/newstoragelocation`}>
                            <NewLocationForm dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/tables`}>
                            <TableList dataset={info}/>
                        </Route>
                        <Route path={`/dataset/:uri/newtable`}>
                            <NewTable dataset={info}/>
                        </Route>
                    </Switch>
                </Col>
            </Row>
        </Container>
    </FullScreen>
}


export default DatasetView
