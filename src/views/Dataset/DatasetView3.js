import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Tabs, Tab,Badge} from "react-bootstrap";
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


import StorageLocationList from "./DatasetStorageLocations/StorageLocationList";
import NewLocationForm from "./DatasetStorageLocations/NewLocation";
import StorageLocationPermissionList from "./DatasetStorageLocations/StorageLocationPermissionList";
import NewLocationPermission from "./DatasetStorageLocations/NewLocationPermission";

import TableList from "./DatasetTables/TableList";
import NewTable from "./DatasetTables/NewTable";
import TablePermissionList from "./DatasetTables/TablePermissionList";
import NewTablePermission from "./DatasetTables/NewTablePermission";
import EnvironmentOverview from "../EnvironmentPlayground/EnvironmentOverview";
import DatasetContributors from "./DatasetContributors";
import DatasetTableList from "./bak/Tables/DatasetTables";

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

const FullScreen=styled.div`
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

const DatasetView=(props)=>{
    let params= useParams();
    console.log(params);
    let client = useClient();
    let [info,setInfo] = useState({});
    let [canEdit, setCanEdit] = useState(false);
    let [ready, setReady] = useState(false);
    let [key, setKey] = useState('Overview');
    useEffect(()=>{
        if (client){
            client
                .query(getDataset(params.uri))
                .then((res)=>{
                    if (!res.errors){
                        setInfo(res.data.getDataset);
                        setReady(true);
                        setCanEdit(['Owner','Admin','ReadWrite'].indexOf(res.data.getDataset.userRoleForDataset)!=-1)
                    }
                });
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
            <Row className={"ml-0 border-bottom"}>
                <Col  xs={1}>
                    <Icon.Folder size={32}/>...
                </Col>
                <Col className={``} xs={4}>
                    <Row>
                        <Col xs={12}>
                            <h4>{info.label}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <p>by <a href={"#"}>{info.owner}</a></p>
                        </Col>
                    </Row>

                </Col>
                <Col className={`border-right `} xs={2}>
                    <Tag tag={info.userRoleForDataset}/>
                </Col>
            </Row>

            <Row className={`mt-1`}>
                <Col xs={12}>
                    <Tabs
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                    >
                        <Tab eventKey="Overview" title="Overview">
                            <DatasetOverview dataset={info}/>
                        </Tab>
                        <Tab eventKey="Details" title="Details">
                            <DatasetDetails dataset={info}/>
                        </Tab>
                        <Tab eventKey="Summaru" title="Summary">
                            <DatasetSummary dataset={info}/>
                        </Tab>
                        <Tab eventKey="Contributors" title="Contributors">
                            <DatasetContributorList dataset={info}/>
                        </Tab>
                        <Tab eventKey="Shares" title="Shares">
                            <ShareObjectList dataset={info}/>
                        </Tab>
                        <Tab eventKey="Tables" title="Tables">
                            <TableList dataset={info}/>
                        </Tab>
                        <Tab eventKey="Folder" title="Folders">
                            <StorageLocationList dataset={info}/>
                        </Tab>

                    </Tabs>
                </Col>
            </Row>
        </Container>

    </FullScreen>
    return <FullScreen>
        <Container>

            <Row className={"ml-0 border-bottom"}>
                        <Col className="pt-3" xs={1}>
                            <Icon.Folder size={32}/>
                        </Col>
                        <Col className={`border-right mt-3`} xs={4}>
                            <Row>
                                <h4>{info.label}</h4>
                            </Row>
                            <Row>
                                <p>by <a href={"#"}>{info.owner}</a></p>
                            </Row>

                        </Col>
                        <Col className={`border-right mt-3`} xs={2}>
                            <Tag tag={info.userRoleForDataset}/>
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
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/summary`}>Summary</Link>
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
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/contributors`}>Contributors</Link>
                        </Col>
                    </Row>
                    <Row className={`mt-1`}>
                        <Col xs={12}>
                            <Link style={{color:'black'}} to={`/dataset/${params.uri}/shares`}>Share Objects</Link>
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

                    {/**
                    <Row className={`mt-1`}>
                        <Col xs={12}>Discussions</Col>
                    </Row>
                     **/}
                </Col>
                <Col xs={10}>
                    <Switch>
                        <Route path={`/dataset/:uri/overview`}>
                            <DatasetOverview dataset={info}/>
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
