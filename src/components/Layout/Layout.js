import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
    BrowserRouter as Router, Switch, Route, useLocation
} from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import BodyStyled from './BodyStyled';
import SidebarStyled from './SidebarStyled';
import MainStyled from './MainStyled';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Home from '../../views/Home/Home';
import Tenant from '../../views/Tenant/TenantView';
import GetStarted from '../../views/GetStarted/GetStarted';
import DatasetList from '../../views/Dataset/DatasetList2';
import ProjectList from '../../views/Project/ProjectList';
import DatasetView from '../../views/Dataset/DatasetView2';
import NewDatasetForm from '../../views/Dataset/NewDatasetForm';
import ProjectView from '../../views/Project/ProjectView2';
import NewProjectForm from '../../views/Project/NewProjectForm';
import OrganizationList from '../../views/Organization/Organizations/OrganizationList';
import OrganizationDashboard from '../../views/Organization/OrganizationDashboard/OrganizationDashboard';
import NewOrganizationForm from '../../views/Organization/NewOrganizationForm';
import EditOrganizationForm from '../../views/Organization/EditOrganizationForm';
import OrganizationUserList from '../../views/Organization/OrganizationUsers/OrganizationUserList';
import NewUserForm from '../../views/Organization/OrganizationUsers/NewUserForm';
import OrganizationGroupList from '../../views/Organization/OrganizationGroups/OrganizationGroupList';
import GroupMemberList from '../../views/Organization/OrganizationGroups/GroupMemberList';
import NewGroupForm from '../../views/Organization/OrganizationGroups/NewGroupForm';
import EditGroupForm from '../../views/Organization/OrganizationGroups/EditGroupForm';
import NewGroupMemberForm from '../../views/Organization/OrganizationGroups/NewGroupMemberForm';
import OrganizationEnvironmentList from '../../views/Organization/OrganizationEnvironments/OrganizationEnvironmentList3';
import NewEnvironmentForm from '../../views/Organization/OrganizationEnvironments/NewEnvironmentForm';
import EditEnvironmentForm from '../../views/Organization/OrganizationEnvironments/EditEnvironmentForm';
import EnvironmentPermissionList from '../../views/Organization/OrganizationEnvironments/EnvironmentPermissionList';
import EnvironmentNotMembersList from '../../views/Organization/OrganizationEnvironments/EnvironmentNotMembersList';
import EnvironmentClusterList from '../../views/Organization/OrganizationEnvironments/EnvironmentCluster/EnvironmentClusterList';
import EnvironmentPlayground from '../../views/EnvironmentPlayground/EnvironmentPlayground';
import ImportClusterForm from '../../views/Organization/OrganizationEnvironments/EnvironmentCluster/ImportClusterForm';
import Catalog from '../../views/Catalog/Catalog2';
import QueryEditor from '../../views/Query/QueryEditor';
import TableExplorer from '../../views/Table/TableExplorer';
import Notifications from '../../views/DataAccessRequest/Notifications';
import NewDataRequestAccess from '../../views/DataAccessRequest/NewRequest';
import UserProfile from '../../views/Profile/UserProfile';
import EnvironmentList from '../../views/Environment/EnvironmentList';
import DashboardList from '../../views/Dashboards/DashboardList';
import NewDashboardForm from '../../views/Dashboards/NewDashboardForm';
import DashboardAdmin from '../../views/Dashboards/DashboardAdmin';

import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';
import ValidateShareObject from '../../views/DataAccessRequest/ValidateShareAccess';
import SqlPipelineList from '../../views/SqlPipelines/SqlPipelineList';
import NewSqlPipelineForm from '../../views/SqlPipelines/NewSqlPipelineForm';
import SqlPipelineAdmin from '../../views/SqlPipelines/SqlPipelineAdmin';
import NewRedshiftCluster from '../../views/RedshiftClusters/NewCluster';
import RedshiftClusterList from '../../views/RedshiftClusters/ClusterList';
import RedshiftClusterView from '../../views/RedshiftClusters/ClusterView';
import Datashopper from '../../views/Project/ProjectDatasets/Datashopper';

const Layout = (props) => {
    const [sidebarState, setSidebarState] = useState(true);
    const toggle = () => {
        setSidebarState(!sidebarState);
    };


    return (
        <Router>


            <BodyStyled>
                <SidebarStyled open={sidebarState}>
                    <Sidebar open={sidebarState} close={toggle} />
                </SidebarStyled>
                <MainStyled sidebar={sidebarState}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <Header />
                            </Col>
                        </Row>
                        <Row style={{ height: '1rem' }} className={'bg-white'}>
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
                                    pauseOnHover
                                />
                            </Col>
                        </Row>
                        <Row className={''}>
                            <Col xs={12} className={' mt-0 '}>
                                <Switch>
                                    <Route exact path={'/validate-access-request/:linkid'}>
                                        <ValidateShareObject />
                                    </Route>
                                    <Route path={'/playground/:uri'}>
                                        <EnvironmentPlayground />
                                    </Route>
                                    <Route path={'/tenant-administrators'}>
                                        <Tenant />
                                    </Route>
                                    <Route path={'/catalog'}>
                                        <Catalog />
                                    </Route>
                                    <Route path={'/datasets'}>
                                        <DatasetList />
                                    </Route>
                                    <Route path={'/dashboards'}>
                                        <DashboardList />
                                    </Route>
                                    <Route path={'/newdashboard'}>
                                        <NewDashboardForm />
                                    </Route>

                                    <Route path={'/sqlpipeline/:uri'}>
                                        <SqlPipelineAdmin />
                                    </Route>

                                    <Route path={'/sqlpipelines'}>
                                        <SqlPipelineList />
                                    </Route>
                                    <Route path={'/newsqlpipeline'}>
                                        <NewSqlPipelineForm />
                                    </Route>

                                    <Route path={'/dashboardadmin/:uri/overview'}>
                                        <DashboardAdmin />
                                    </Route>


                                    <Route path={'/projects'}>
                                        <ProjectList />
                                    </Route>
                                    <Route path={'/environments'}>
                                        <EnvironmentList />
                                    </Route>
                                    <Route path={'/group/:uri/members'}>
                                        <GroupMemberList />
                                    </Route>
                                    <Route path={'/environment/:uri/permissions'}>
                                        <EnvironmentPermissionList />
                                    </Route>
                                    <Route path={'/getstarted'}>
                                        <GetStarted />
                                    </Route>
                                    <Route path={'/organization/:uri/dashboard'}>
                                        <OrganizationDashboard />
                                    </Route>
                                    <Route path={'/profile'}>
                                        <UserProfile />
                                    </Route>
                                    <Route path={'/environment/:uri/clusters'}>
                                        <EnvironmentClusterList />
                                    </Route>
                                    <Route path={'/dataset/:uri'}>
                                        <DatasetView />
                                    </Route>
                                    <Route path={'/project/:uri'}>
                                        <ProjectView />
                                    </Route>
                                    <Route path={'/notifications'}>
                                        <Notifications />
                                    </Route>
                                    <Route path={'/newproject'}>
                                        <NewProjectForm />
                                    </Route>
                                    <Route path={'/newdataaccessrequest/:uri'}>
                                        <NewDataRequestAccess />
                                    </Route>
                                    <Route path={'/query/:uri'}>
                                        <QueryEditor />
                                    </Route>
                                    <Route path={'/organization/:uri/users'}>
                                        <OrganizationUserList />
                                    </Route>
                                    <Route path={'/neworganization'}>
                                        <NewOrganizationForm />
                                    </Route>
                                    <Route path={'/editorganization/:uri'}>
                                        <EditOrganizationForm />
                                    </Route>
                                    <Route path={'/newgroupmember/:uri'}>
                                        <NewGroupMemberForm />
                                    </Route>
                                    <Route path={'/newdataset'}>
                                        <NewDatasetForm />
                                    </Route>
                                    <Route path={'/newenvironmentpermission/:uri'}>
                                        <EnvironmentNotMembersList />
                                    </Route>
                                    <Route path={'/newenvironmentcluster/:uri'}>
                                        <ImportClusterForm />
                                    </Route>
                                    <Route path={'/editgroup/:uri'}>
                                        <EditGroupForm />
                                    </Route>
                                    <Route path={'/editenvironment/:uri'}>
                                        <EditEnvironmentForm />
                                    </Route>
                                    <Route path={'/newuser/:uri'}>
                                        <NewUserForm />
                                    </Route>
                                    <Route path={'/newgroup/:uri'}>
                                        <NewGroupForm />
                                    </Route>
                                    <Route path={'/newenvironment/:uri'}>
                                        <NewEnvironmentForm />
                                    </Route>
                                    <Route path={'/organization/:uri/environments'}>
                                        <OrganizationEnvironmentList />
                                    </Route>
                                    <Route path={'/organization/:uri/groups'}>
                                        <OrganizationGroupList />
                                    </Route>
                                    <Route path={'/organizations'}>
                                        <OrganizationList />
                                    </Route>
                                    <Route path={'/table/:datasetUri/:tableUri'}>
                                        <TableExplorer />
                                    </Route>

                                    <Route path={'/redshiftclusters'}>
                                        <RedshiftClusterList />
                                    </Route>
                                    <Route path={'/newredshiftcluster'}>
                                        <NewRedshiftCluster />
                                    </Route>
                                    <Route path={'/redshiftcluster/:uri'}>
                                        <RedshiftClusterView />
                                    </Route>
                                    <Route path={'/'}>
                                        <Home />
                                    </Route>

                                </Switch>

                            </Col>
                        </Row>
                    </Container>

                </MainStyled>
            </BodyStyled>
        </Router>
    );
};


export default Layout;
