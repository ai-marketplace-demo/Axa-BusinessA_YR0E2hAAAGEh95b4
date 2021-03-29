import React, {useContext, useState, Suspense, lazy, useEffect} from "react";
import {BrowserRouter ,Switch, Route} from "react-router-dom"
import * as Organization from './views/Organizations';
import * as Glossary from './views/Glossary';
import * as Dataset from './views/Datasets';
import * as Tables from './views/Table';
import * as Pipelines from './views/Pipelines';
import * as Worksheets from './views/Worksheet';
import * as Notebooks from './views/Notebooks';
import * as Dashboards from './views/Dashboards';
import * as Environments from './views/Environments';
import * as Catalog from "./views/Catalog";
import * as Home from "./views/Home";
import * as Shares from "./views/Shares";
import Comments from "./views/Comments/Comments";
import * as Collections from "./views/Collections";
import  styled from "styled-components";
import {ThemeContext} from "./components/layout";
import * as Dropdown from "./components/dropdown";
import * as Feed from "./views/Feed";
import * as Workflows from './views/Workflows';
import * as Warehouses from './views/Warehouses';
import * as Profile from './views/Profile';
import GlossarySelect from "./components/glossaryeditor/GlossarySelect";



const FullScreen = (props)=>{
    const context = useContext(ThemeContext);
    useEffect(()=>{
        context.enterFullscreen()
        return ()=>{context.leaveFullscreen()};
    },[context]);
    return <div style={{
        display:'inline-block',
        //border:'8px solid blue',
        padding:'1rem',
        width: '100%',
        height:'100%'}}>
        {
            React.Children.only(props.children)
        }
    </div>
}
const Router=(props)=>{
    const contextType = ThemeContext;
    return <Switch>
        <Route path="/discover">
            <FullScreen>
                <Catalog.Catalog/>
            </FullScreen>
        </Route>
        <Route path="/organizations">
            <Organization.OrganizationList/>
        </Route>
        <Route path="/environments/:uri?">
            <Environments.EnvironmentList/>
        </Route>
        <Route path="/new-environment/:uri">
            <FullScreen>
                <Environments.EnvironmentForm/>
            </FullScreen>
        </Route>
        <Route path="/environment/:uri/:tab?">
            <FullScreen>
                <Environments.EnvironmentView/>
            </FullScreen>
        </Route>
        <Route path={`/feed/:type/:uri/`}>
            <Feed.FeedView/>
        </Route>
        <Route path="/glossaries">
            <Glossary.GlossaryList/>
        </Route>
        <Route path="/datasets">
            <Dataset.DatasetList/>
        </Route>
        <Route path={"/share/:uri/:tab?"}>
            <FullScreen>
                <Shares.ShareView/>
            </FullScreen>
        </Route>
        <Route path={"/request/:kind/:uri/:tab?"}>
            <FullScreen>
                <Shares.ShareRequestForm/>
            </FullScreen>
        </Route>
        <Route path="/tables">
            <Tables.TableList/>
        </Route>
        <Route path="/pipelines">
            <Pipelines.PipelineList/>
        </Route>
        <Route path="/worksheets">
            <Worksheets.WorksheetList/>
        </Route>
        <Route path="/new-worksheet">
            <FullScreen>
                <Worksheets.QueryForm/>
            </FullScreen>
        </Route>
        <Route path="/query/:uri/:tab?">
            <FullScreen>
                <Worksheets.QueryView/>
            </FullScreen>
        </Route>
        <Route path="/worksheet/:uri">
            <FullScreen>
                <Worksheets.Worksheet/>
            </FullScreen>
        </Route>
        <Route path="/new-pipeline">
            <FullScreen>
                <Pipelines.PipelineForm/>
            </FullScreen>
        </Route>
        <Route path="/pipeline/:uri/:tab?/">
            <FullScreen>
                <Pipelines.PipelineView/>
            </FullScreen>
        </Route>
        <Route path="/table/:uri/:tab?">
            <FullScreen>
                <Tables.TableView/>
            </FullScreen>
        </Route>
        <Route path="/notebooks">
            <Notebooks.NotebookList/>
        </Route>
        <Route path="/notebook/:uri/:tab?">
            <FullScreen>
                <Notebooks.NotebookView/>
            </FullScreen>
        </Route>
        <Route path="/new-notebook">
            <FullScreen>
                <Notebooks.NotebookForm/>
            </FullScreen>
        </Route>
        <Route path={"/new-organization"}>
            <FullScreen>
                <Organization.OrganizationForm/>
            </FullScreen>
        </Route>
        <Route path={"/organization/:uri/:tab?"}>
            <FullScreen>
                <Organization.OrganizationView/>
            </FullScreen>
        </Route>

        <Route path={"/new-dataset"}>
            <FullScreen>
                <Dataset.DatasetForm/>
            </FullScreen>
        </Route>
        <Route path={"/import-dataset"}>
            <FullScreen>
                <Dataset.DatasetImport/>
            </FullScreen>
        </Route>
        <Route path={"/dataset/:uri/:tab?"}>
            <FullScreen>
                <Dataset.DatasetView/>
            </FullScreen>
        </Route>

        <Route path={"/dashboards"}>
            <Dashboards.DashboardList/>
        </Route>
        <Route path={"/new-dashboard"}>
            <FullScreen>
                <Dashboards.DashboardForm/>
            </FullScreen>
        </Route>
        <Route path={"/qs/select"}>
            <FullScreen>
                <Dashboards.DashboardSessionStarter/>
            </FullScreen>
        </Route>
        <Route path={"/new-glossary"}>
            <FullScreen>
                <Glossary.GlossaryForm/>
            </FullScreen>
        </Route>
        <Route path={"/glossary/:uri/:tab?"}>
            <FullScreen>
                <Glossary.GlossaryView/>
            </FullScreen>
        </Route>
        <Route path={"/dashboard/:uri/:tab?"}>
            <FullScreen>
                <Dashboards.DashboardView/>
            </FullScreen>
        </Route>
        <Route path={"/comments/:uri"}>
            <FullScreen>
                <Comments/>
            </FullScreen>
        </Route>
        <Route path={"/collections"}>
            <Collections.CollectionList/>
        </Route>
        <Route path={"/collection/:uri/:tab?"}>
            <FullScreen>
                <Collections.CollectionView/>
            </FullScreen>
        </Route>
        <Route path="/new-collection">
            <FullScreen>
                <Collections.CollectionForm/>
            </FullScreen>
        </Route>
        <Route path={"/new-workflow"}>
            <FullScreen>
                <Workflows.WorkflowForm/>
            </FullScreen>
        </Route>
        <Route path={"/workflows"}>
            <FullScreen>
                <Workflows.WorkflowList/>
            </FullScreen>
        </Route>
        <Route path={"/workflow/:uri/:tab?"}>
            <FullScreen>
                <Workflows.WorkflowView/>
            </FullScreen>
        </Route>
        <Route path={"/new-warehouse/:uri?"}>
            <FullScreen>
                <Warehouses.WarehouseForm/>
            </FullScreen>
        </Route>
        <Route path={"/warehouse/:uri/:tab?"}>
            <FullScreen>
                <Warehouses.WarehouseView/>
            </FullScreen>
        </Route>
        <Route path={"/profile/:tab?"}>
            <FullScreen>
                <Profile.Profile/>
            </FullScreen>
        </Route>
        <Route  path="/xp">
            <FullScreen>
                <GlossarySelect />
            </FullScreen>
        </Route>
        <Route path="/">
            <FullScreen>
                <Catalog.Catalog/>
            </FullScreen>
        </Route>
    </Switch>
}


export default Router;
