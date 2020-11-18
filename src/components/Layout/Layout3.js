import React, {useState,useEffect} from "react";
import BodyStyled from "./BodyStyled";
import SidebarStyled from "./SidebarStyled";
import MainStyled from "./MainStyled";
import Sidebar from "../Sidebar/Sidebar";
import * as MdIcon  from 'react-icons/md';
import * as ImIcon  from 'react-icons/im';
import * as SiIcon from "react-icons/si";

import Header from "../Header/Header2";
import {If, Then, Else} from "react-if";
import {Container, Row, Col} from "react-bootstrap";
import {BrowserRouter as Router, Switch, Route, useLocation, useParams,Link} from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import Home from "../../views/Home/Home";
import Tenant from "../../views/Tenant/TenantView";
import GetStarted from "../../views/GetStarted/GetStarted";
import DatasetList from "../../views/Dataset2/DatasetList";
import ProjectList from "../../views/Project/ProjectList";
import DatasetView from "../../views/Dataset2/DatasetView";
import NewDatasetForm from "../../views/Dataset/NewDatasetForm";
import ProjectView from "../../views/Project/ProjectView2";
import NewProjectForm from "../../views/Project/NewProjectForm";
import OrganizationList from "../../views/Organization/Organizations/OrganizationList";
import OrganizationDashboard from "../../views/Organization/OrganizationDashboard/OrganizationDashboard";
import NewOrganizationForm from "../../views/Organization/NewOrganizationForm";
import EditOrganizationForm from "../../views/Organization/EditOrganizationForm";
import OrganizationUserList from "../../views/Organization/OrganizationUsers/OrganizationUserList";
import NewUserForm from "../../views/Organization/OrganizationUsers/NewUserForm";
import OrganizationGroupList from "../../views/Organization/OrganizationGroups/OrganizationGroupList";
import GroupMemberList from "../../views/Organization/OrganizationGroups/GroupMemberList";
import NewGroupForm from "../../views/Organization/OrganizationGroups/NewGroupForm";
import EditGroupForm from "../../views/Organization/OrganizationGroups/EditGroupForm";
import NewGroupMemberForm from "../../views/Organization/OrganizationGroups/NewGroupMemberForm";
import OrganizationEnvironmentList from "../../views/Organization/OrganizationEnvironments/OrganizationEnvironmentList";
import NewEnvironmentForm from "../../views/Organization/OrganizationEnvironments/NewEnvironmentForm";
import EditEnvironmentForm from "../../views/Organization/OrganizationEnvironments/EditEnvironmentForm";
import EnvironmentPermissionList from "../../views/Organization/OrganizationEnvironments/EnvironmentPermissionList";
import EnvironmentNotMembersList from "../../views/Organization/OrganizationEnvironments/EnvironmentNotMembersList";
import EnvironmentClusterList from "../../views/Organization/OrganizationEnvironments/EnvironmentCluster/EnvironmentClusterList";
import EnvironmentPlayground from "../../views/EnvironmentPlayground/EnvironmentPlayground";
import ImportClusterForm from "../../views/Organization/OrganizationEnvironments/EnvironmentCluster/ImportClusterForm";
import Catalog from "../../views/Catalog/Catalog2";
//import QueryEditor from "../../views/Query/QueryEditor";
import QueryList from "../../views/SavedQueries/QueryList";
import QueryEditor from "../../views/SavedQueries/QueryEditor";
import QueryForm from "../../views/SavedQueries/ScheduledQueryForm";
import TableExplorer from "../../views/Table/TableExplorer";
import Notifications from "../../views/DataAccessRequest/Notifications";
import NewDataRequestAccess from "../../views/DataAccessRequest/NewRequest"
import UserProfile from "../../views/Profile/UserProfile";
import EnvironmentList from "../../views/Environment/EnvironmentList";
import DashboardList from "../../views/Dashboards/DashboardList";
import NewDashboardForm from "../../views/Dashboards/NewDashboardForm";
import DashboardAdmin from "../../views/Dashboards/DashboardAdmin";
import ValidateShareObject from "../../views/DataAccessRequest/ValidateShareAccess";
import SqlPipelineList from "../../views/SqlPipelines/SqlPipelineList";
import NewSqlPipelineForm from "../../views/SqlPipelines/NewSqlPipelineForm";
import SqlPipelineAdmin from "../../views/SqlPipelines/SqlPipelineAdmin";
import styled from "styled-components";
import SidebarLink from "./SidebarLink";
import ShareManager from "../../views/ShareManager/ShareManager";
import XP from "../../views/XP/XP";
import Graph from "../../views/XP/Graph";
import ES from "../../views/XP/ES";
import NotebookList from "../../views/Notebook/NotebookList";
import QueryTool from "../../views/XP/QueryEditor";
import {Slide, ToastContainer} from "react-toastify";
import NotebookForm from "../../views/Notebook/NotebookForm";
import RedshiftClusterList from "../../views/RedshiftClusters/ClusterList";
import NewRedshiftCluster from "../../views/RedshiftClusters/NewCluster";
import ImportRedshiftCluster from "../../views/RedshiftClusters/ImportCluster";
import RedshiftClusterView from "../../views/RedshiftClusters/ClusterView";

const Hoverable=styled.div`
&:hover{
  background-color: ghostwhite;
}`

const Footer=styled.div`
  margin-top: 1rem;
  padding-bottom: 2rem;
  padding-left: 10rem;
  color: white;
  background-color: #323;
  border-top:1px solid lightgrey;
  position: fixed;
  bottom: 0;
  height: 4ch;
  left: 0;
  z-index: 2;
  width: 100%;
  __display: flex;
`


const Circle=styled.div`
height:3ch;
width:3ch;
border-radius: 50%;
font-family: Cairo;
#border:1px solid white;
text-align: center;
font-weight: bolder;
background-color: lightseagreen;

`



const Layout = (props) => {
    const [sidebar, setSidebar] = useState(false);
    const [profileMenuDisplayed,setProfileMenuDisplayed] = useState(false)
    const toggle= ()=>{
        setSidebar(!sidebar);
    }

    return <Container style={{__backgroundImage:'linear-gradient(to bottom, #f7fbfc 13%, white)'}} className={``} fluid>
        <Router>
            {/**
            <Row style={{width:'100%',zIndex:'999',top:0,position: 'sticky', marginLeft:'0'}} className={` p-0 m-0 bg-white `}>
                <Col style={{marginLeft:'0'}} className={`m-0`} xs={12}>
                    <div

                        style={{
                            display:'flex' ,
                            //boxShadow:'0px 2px 3px 0px rgba(0, 0, 255, .2)',
                            //borderRadius:'0px 0px 18px 18px'
                        }} className={`border-bottom   text-black pt-2 pb-2 `}>
                        <div style={{width:'5%'}}></div>
                        <div style={{display:'grid',fontSize:'1.2rem',fontWeight:'bolder',width:'15%'}}className={``}>
                            <b>[d]atahub</b>
                            <i style={{fontSize:'0.77777777777rem'}}>simplified cloud analytics</i>
                        </div>
                        <div style={{width:'70%'}}></div>
                        <div
                            onClick={()=>{setProfileMenuDisplayed(!profileMenuDisplayed)}}
                            className={`shadow text-white  text-center rounded-pill `}
                             style={{
                                 paddingTop:'0.1rem',
                                 backgroundColor:'teal',
                                 fontFamily:'Roboto' ,
                                 fontSize:'1.1rem',
                                 width:`2rem`,
                                 height:'2rem'
                             }}>
                            m
                        </div>

                    </div>
                </Col>
            </Row>
             **/}
             <Header setProfileMenuDisplayed={setProfileMenuDisplayed} profileMenuDisplayed={profileMenuDisplayed}/>
            <Row style={{backgroundColor:'transparent'}} className={`m-0`}>
                <If condition={sidebar}>
                    <Then>
                    <Col style={{
                        zIndex:'1',
                        //boxShadow:'1px -3px 1px 1px rgba(0, 0, 255, .2)',
                        __borderRadius:'0 25% 0 0',
                        //backgroundColor:'white',
                        height:'auto !important',
                        minHeight:"100vh",
                        width:'100%',
                        backgroundImage:'linear-gradient(to top, #f5f9fa  10%, white 20%)',
                        //backgroundColor:'white',
                        position:'fixed'
                    }} className={` m-0 mt-1 border-right`} xs={2}>
                        <Row className={``}>
                            <Col xs={10}/>
                            <Col className={``} xs={2}><Icon.ChevronLeft  color={"black"} onClick={toggle}/></Col>
                        </Row>
                        <Row className={``} style={{marginTop:'2%'}}>
                            {/**
                             <Col className={` mt-1 mb-1`}xs={12}>
                             <b className={`text-capitalize`}>CATALOG</b>
                             </Col>
                             **/}
                            <SidebarLink icon={<Icon.Folder2Open />}to={"/es"} label={"Catalog"}/>
                            {/**<SidebarLink icon={<Icon.Chat />}to={"/es"} label={"Ask"}/>**/}

                            <SidebarLink icon={<Icon.FolderPlus />}to={"/datasets"} label={"Contribute"}/>

                            {/**

                             <Col className={`mt-1 mb-1 `}xs={12}>
                             <b className={`text-capitalize`}>PLAY</b>
                             </Col>
                             **/}
                            <SidebarLink icon={<Icon.Server/>}to={"/redshiftclusters"} label={"Warehouses"}/>
                            <SidebarLink icon={<MdIcon.MdShowChart />}to={"/dashboards"} label={"Dashboards"}/>
                            <SidebarLink icon={<Icon.Terminal/>}to={"/queries"} label={"Queries"}/>
                            <SidebarLink icon={<SiIcon.SiJupyter/>}to={"/notebooks"} label={"Notebooks"}/>
                            <SidebarLink icon={<Icon.Gear />}to={"/sqlpipelines"} label={"Pipelines"}/>
                            {/**
                             <Col className={`mt-1 mb-1`}xs={12}>
                             <b>COLLABORATE</b>
                             </Col>
                             **/}

                            <SidebarLink icon={<Icon.House />}to={"/organizations"} label={"Organizations"}/>
                            <SidebarLink icon={<Icon.Cloud />}to={"/environments"} label={"Environments"}/>
                            {/**<SidebarLink icon={<Icon.Journal size={12}/>}to={"/"} label={"Recent Activities"}/>**/}
                            {/**<SidebarLink icon={<Icon.Play/>}to={"/xp"} label={"XP"}/>**/}
                        </Row>

                    </Col>
                    </Then>
                    <Else>
                        <div
                            className={`border-right`}
                            style={{
                                zIndex:'1',
                                //boxShadow:'1px -1px 1px 1px rgba(0, 0, 255, .2)',
                                height:'auto !important',
                                //backgroundImage:'linear-gradient(to right, #f5f9fa  3%, white 20%)',
                                backgroundColor:"white",
                                minHeight:"100vh",
                                position:'fixed',
                                width:'3%'}}
                        >
                            <Row>
                                <Col className={`ml-1 mt-1`} xs={2}><Icon.ChevronRight  color={'black'} onClick={toggle}/></Col>
                            </Row>

                        </div>
                    </Else>
                </If>

                <Col style={{
                    height:'auto !important',
                    minHeight:"100vh",
                    width: "97%",
                    backgroundColor:'transparent'
                }} className={''} xs={12}>
                    <Row  className={"bg-white"}>
                        <Col xs={12}>
                            <ToastContainer
                                transition={Slide}
                                position="top-center"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnVisibilityChange
                                draggable
                                pauseOnHover/>
                        </Col>
                    </Row>
                    <If condition={profileMenuDisplayed}>
                        <Then>
                            <Row>
                                <Col xs={10}/>
                                    <Col xs={2}>
                                        <div style={{
                                            backgroundColor:'white',
                                            zIndex:999,
                                            height:'100vh',
                                            __borderRadius:'12px',
                                            __boxShadow:'-3px 2px 1px lightgrey',
                                            position: "fixed",
                                            width: '100%',
                                            paddingTop:'2%',
                                            paddingLeft:'2%',
                                            borderLeft: '1px solid lightgrey'
                                        }}>
                                            <Row>
                                                <Col xs={2}>
                                                    <Icon.X onClick={()=>{setProfileMenuDisplayed(false)}}/>
                                                </Col>
                                                <Col className={`mt-2`} xs={12}>
                                                    <SidebarLink icon={<Icon.PersonBadge />}to={"/profile"} label={"Profile"}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <SidebarLink icon={<Icon.DoorClosed />}to={"/"} label={"Logout"}/>

                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <SidebarLink icon={<Icon.Key />}to={"/"} label={"Api keys"}/>

                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <div style={{color:'black',fontWeight:'bolder'}}> My Requests</div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <SidebarLink icon={<Icon.ArrowBarRight/>}to={"/"} label={"Outgoing"}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <SidebarLink icon={<Icon.ArrowBarLeft/>}to={"/"} label={"Incoming"}/>

                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                            </Row>
                        </Then>
                    </If>
                    <Row className={`mr-1`}style={{zIndex:'-1'}}>
                        <If className={`bg-dark`} condition={sidebar}>
                            <Then>
                                <Col xs={2}></Col>
                            </Then>
                        </If>
                        <Col style={{marginLeft:sidebar?"0%":"3%"}}className={``} xs={sidebar?10:12}>
                            <Switch>
                                <Route exact path={`/xp`}>
                                    <Graph/>
                                </Route>
                                <Route exact path={`/es`}>
                                    <ES/>
                                </Route>
                                <Route exact path={`/validate-access-request/:linkid`}>
                                    <ValidateShareObject/>
                                </Route>
                                <Route path={"/access-request/:shareUri"}>
                                    <ShareManager/>
                                </Route>
                                <Route path={`/playground/:uri`}>
                                    <EnvironmentPlayground/>
                                </Route>
                                <Route path={`/tenant-administrators`}>
                                    <Tenant/>
                                </Route>
                                <Route path={`/queries`}>
                                    <QueryList/>
                                </Route>
                                <Route path={`/catalog`}>
                                    <Catalog/>
                                </Route>
                                <Route path={`/datasets`}>
                                    <DatasetList/>
                                </Route>
                                <Route path={`/dashboards`}>
                                    <DashboardList/>
                                </Route>
                                <Route path={`/newdashboard`}>
                                    <NewDashboardForm/>
                                </Route>
                                <Route path={`/notebooks`}>
                                    <NotebookList/>
                                </Route>

                                <Route path={`/new-notebook`}>
                                    <NotebookForm/>
                                </Route>
                                <Route path={`/new-scheduled-query`}>
                                    <QueryForm/>
                                </Route>
                                <Route path={`/sqlpipeline/:uri`}>
                                    <SqlPipelineAdmin/>
                                </Route>

                                <Route path={`/sqlpipelines`}>
                                    <SqlPipelineList/>
                                </Route>
                                <Route path={`/newsqlpipeline`}>
                                    <NewSqlPipelineForm/>
                                </Route>

                                <Route path={`/dashboardadmin/:uri/:tab?`}>
                                    <DashboardAdmin/>
                                </Route>



                                <Route path={`/projects`}>
                                    <ProjectList/>
                                </Route>
                                <Route path={`/environments`}>
                                    <EnvironmentList/>
                                </Route>
                                <Route path={`/group/:uri/members`}>
                                    <GroupMemberList/>
                                </Route>
                                <Route path={`/environment/:uri/permissions`}>
                                    <EnvironmentPermissionList/>
                                </Route>
                                <Route path={`/getstarted`}>
                                    <GetStarted/>
                                </Route>
                                <Route path={`/organization/:uri/dashboard`}>
                                    <OrganizationDashboard/>
                                </Route>
                                <Route path={`/profile`}>
                                    <UserProfile/>
                                </Route>
                                <Route path={`/environment/:uri/clusters`}>
                                    <EnvironmentClusterList/>
                                </Route>
                                <Route path={`/dataset/:uri/:tab?/:tableUri?`}>
                                    <DatasetView/>
                                </Route>
                                <Route path={`/project/:uri`}>
                                    <ProjectView/>
                                </Route>
                                <Route path={`/notifications`}>
                                    <Notifications/>
                                </Route>
                                <Route path={`/newproject`}>
                                    <NewProjectForm/>
                                </Route>
                                <Route path={`/newdataaccessrequest/:uri`}>
                                    <NewDataRequestAccess/>
                                </Route>
                                <Route path={`/query/:uri?/:tab?`}>
                                    <QueryEditor/>
                                </Route>
                                <Route path={`/organization/:uri/users`}>
                                    <OrganizationUserList/>
                                </Route>
                                <Route path={`/neworganization`}>
                                    <NewOrganizationForm/>
                                </Route>
                                <Route path={`/editorganization/:uri`}>
                                    <EditOrganizationForm/>
                                </Route>
                                <Route path={`/newgroupmember/:uri`}>
                                    <NewGroupMemberForm/>
                                </Route>
                                <Route path={`/newdataset`}>
                                    <NewDatasetForm/>
                                </Route>
                                <Route path={`/newenvironmentpermission/:uri`}>
                                    <EnvironmentNotMembersList/>
                                </Route>
                                <Route path={`/newenvironmentcluster/:uri`}>
                                    <ImportClusterForm/>
                                </Route>
                                <Route path={`/editgroup/:uri`}>
                                    <EditGroupForm/>
                                </Route>
                                <Route path={`/editenvironment/:uri`}>
                                    <EditEnvironmentForm/>
                                </Route>
                                <Route path={`/newuser/:uri`}>
                                    <NewUserForm/>
                                </Route>
                                <Route path={`/newgroup/:uri`}>
                                    <NewGroupForm/>
                                </Route>
                                <Route path={`/newenvironment/:uri`}>
                                    <NewEnvironmentForm/>
                                </Route>
                                <Route path={`/organization/:uri/environments`}>
                                    <OrganizationEnvironmentList/>
                                </Route>
                                <Route path={`/organization/:uri/groups`}>
                                    <OrganizationGroupList/>
                                </Route>
                                <Route path={`/organizations`}>
                                    <OrganizationList/>
                                </Route>
                                <Route path={`/table/:datasetUri/:tableUri`}>
                                    <TableExplorer/>
                                </Route>
                                <Route path={`/redshiftclusters`}>
                                    <RedshiftClusterList/>
                                </Route>
                                <Route path={`/newredshiftcluster`}>
                                    <NewRedshiftCluster/>
                                </Route>
                                <Route path={`/importredshiftcluster`}>
                                    <ImportRedshiftCluster/>
                                </Route>
                                <Route path={`/redshiftcluster/:uri`}>
                                    <RedshiftClusterView/>
                                </Route>
                                <Route path={`/`}>
                                    <Home/>
                                </Route>

                            </Switch>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Router>
    </Container>

}




export default Layout;
