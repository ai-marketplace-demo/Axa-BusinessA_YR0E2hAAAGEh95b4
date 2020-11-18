import React, {useState, useRef,useEffect} from "react";
import {Container, Row, Col, Tabs, Tab,Spinner, Badge,Table} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import RoutedTabs from "../../components/Tabs/Tabs";
import Editor from '@monaco-editor/react';
import {If, Then, Else, Case, Switch, Default} from "react-if";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";
import getSavedQuery from "../../api/SavedQuery/getSavedQuery";
import runSavedQuery from "../../api/SavedQuery/runSavedQuery";
import Select from "react-select";
import styled from "styled-components";
import {toast} from "react-toastify";
import {getRegionLabel} from "../../components/AwsRegions/AwsRegionSelect";
import {Link, useParams} from "react-router-dom";
import ResizePanel from "react-resize-panel";
import getScheduledQuery from "../../api/SavedQuery/getScheduledQuery";
import createSavedQuery from "../../api/SavedQuery/createSavedQuery";
import QueryOverviewTab from "./QueryOverviewTab";
import QueryEditorTab from "./QueryEditorTab";
import QuerySchedulerTab from "./QuerySchedulerTab";
import HumandReadableDate from "../../components/HumanReadableDate/HumanReadableDate";


const QueryAdmin = (props)=>{
    const params = useParams();
    const client = useClient();
    const [query, setQuery] = useState({
        scheduledQuery:null,
        name:'',
        label:'',
        queries:{
            count:0,
            page:1,
            pages:1,
            nodes:[]
        }
    });

    const [ready,setReady] = useState(false);

    const createQuery= async ()=>{
        toast.info("Creating new query ! ");
        const response  = await client.mutate(createSavedQuery ({
            scheduledQueryUri : query.scheduledQueryUri,
            input:{
                label : "new query",
                description: '',
                sqlBody : '-- example query \n select 1 as A'
            }
        }));

        await fetchQuery();
    }



    const fetchQuery = async()=>{
        setReady(false);
        const response = await client.query(getScheduledQuery(params.uri));
        if (!response.errors){
            setQuery({...response.data.getScheduledQuery})
        }else {
            toast(`Could not etrieve query, received ${response.errors[0].message}`)
        }
        setReady(true);
    }

    useEffect(()=>{
        if (client){
            fetchQuery();
        }
    },[client])

    const tabs= ["overview","queries","schedule"]


    return <Container className={`mt-4`} fluid>
        <Row className={`border-top border-bottom mt-3 pt-4 pb-4 `}>
            <Col className={`border-right` } xs={6}>
                <h3><Icon.Terminal/> Query <b className={`text-primary`}>{query.label}</b></h3>
            </Col>
            <Col xs={6}>

            </Col>
            <Col xs={6}>
                Created  by {query.owner} <HumandReadableDate d={query.created}/>
            </Col>

        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <RoutedTabs tabs={tabs}></RoutedTabs>
            </Col>
        </Row>
        <Row>

            <Col xs={12}>
                <Switch>
                    <Case condition={params.tab=="queries"}>
                        <If condition={ready}>
                            <Then>
                               <QueryEditorTab
                                   ready={ready}
                                   client={client}
                                   //saveQuery={saveQuery}
                                   createQuery={createQuery}
                                   query={query}/>
                            </Then>
                        </If>
                    </Case>
                    <Case condition={params.tab=="overview"}>
                        <If condition={ready}>
                            <Then>
                                <QueryOverviewTab
                                    ready={ready}
                                    query={query}/>
                            </Then>
                            <Else>

                            </Else>
                        </If>
                    </Case>
                    <Case condition={params.tab=="schedule"}>
                       <QuerySchedulerTab query={query}/>
                    </Case>
                    <Default>
                        {params.tab}
                    </Default>
                </Switch>
            </Col>
        </Row>
    </Container>
}


export default QueryAdmin;
