import React, {useState, useEffect} from "react";
import {Container, Table,Row, Card,Tabs,Tab,Badge,Col,Spinner} from "react-bootstrap";
import {Link, Route, useHistory,useLocation,useParams} from "react-router-dom";
import {If, Then , Else,Switch,Case,Default} from "react-if";
import styled from "styled-components";
import useClient from "../../api/client";
import RoutedTabs from "../../components/Tabs/Tabs";
import getEnvironment from "../../api/Environment/getEnvironment";
import * as Icon from "react-bootstrap-icons";
import  {toast} from "react-toastify";
import EnvironmentOverview from "./EnvironmentOverview";
import EnvironmentSharedDatasets from "./EnvironmentSharedDatasets";
import EnvironmentDatasets  from "./EnvironmentDatasets";
import Loader from "react-loaders";
import ItemViewHeader from "../../components/ItemViewHeader/ItemViewHeader";



const FullScreen = styled.div`
height:100vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}
`

const EnvironmentPlayground=(props)=>{
    const params= useParams();
    let history = useHistory();
    const [env, setEnv] = useState({});
    const environmentUri = params.uri;
    let client = useClient();
    const [key, setKey] = useState('Details');


    const fetchEnvironment = async ()=>{
        const response = await client.query(getEnvironment ({environmentUri:environmentUri}));
        if (!response.errors){
            setEnv(response.data.getEnvironment);
        }else {
            toast(`Could not retrieve environment data, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchEnvironment()
        }
    },[client])

    if (!env.organization){
        return <Container>
            <Row>
                <Col style={{marginTop: '24%', marginLeft:'43%'}} xs={4}>
                    <Loader color={`lightblue`} type="ball-scale-multiple" />
                </Col>
            </Row>
        </Container>
    }
    return <FullScreen>
        <Container>
            <ItemViewHeader
                label={env.name}
                owner={env.owner}
                status={env.stack.status}
                role={env.userRoleInEnvironment}
                region={env.region}
                created={env.created}
                itemIcon={<Icon.Cloud size={32}/>}
            />
            <Row>
                <Col className={`mt-4`} xs={12}>
                    <RoutedTabs tabs={["details","datasets","shared"]}/>
                </Col>
                <Col className={`mt-4`} xs={12}>
                <If condition={env.userRoleInEnvironment!='NotInvited'}>
                    <Then>
                        <Switch>
                            <Case condition={params.tab=="datasets"}>
                                <EnvironmentDatasets environment={env}/>
                            </Case>
                            <Case condition={params.tab=="shared"}>
                                <EnvironmentSharedDatasets environment={env}/>
                            </Case>
                            <Default>
                                <EnvironmentOverview environment={env}/>
                            </Default>
                        </Switch>
                    </Then>
                    <Else>
                        <EnvironmentOverview environment={env}/>
                    </Else>
                </If>
                </Col>

                {/**
                <Col className={`mt-4`} xs={12}>

                    <If condition={env.userRoleInEnvironment!='NotInvited'}>
                        <Then>
                            <Tabs
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                            >
                                <Tab eventKey="Details" title="Details">
                                    <EnvironmentOverview environment={env}/>
                                </Tab>
                                <Tab eventKey="EnvDatasets" title="Datasets">
                                    <EnvironmentDatasets environment={env}/>
                                </Tab>
                                <Tab eventKey="Datasets" title="Shared Datasets">
                                    <EnvironmentSharedDatasets environment={env}/>
                                </Tab>


                            </Tabs>
                        </Then>
                        <Else>
                            <Tabs
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                            >
                                <Tab eventKey="Details" title="Details">
                                    <EnvironmentOverview environment={env}/>
                                </Tab>
                            </Tabs>


                        </Else>
                    </If>
                </Col>
                **/}
            </Row>
    </Container>
    </FullScreen>
}



export default EnvironmentPlayground;
