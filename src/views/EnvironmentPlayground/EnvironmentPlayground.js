import React, {useState, useEffect} from "react";
import {Container, Table,Row, Card,Tabs,Tab,Badge,Col,Spinner} from "react-bootstrap";
import {Link, Route, Switch,useHistory,useLocation,useParams} from "react-router-dom";
import {If, Then , Else} from "react-if";
import styled from "styled-components";
import useClient from "../../api/client";
import getEnvironment from "../../api/Environment/getEnvironment";
import * as Icon from "react-bootstrap-icons";
import  {toast} from "react-toastify";
import EnvironmentOverview from "./EnvironmentOverview";
import EnvironmentSharedDatasets from "./EnvironmentSharedDatasets";
import EnvironmentDatasets  from "./EnvironmentDatasets";



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
        return <Spinner variant={`primary`} animation={`grow`}/>
    }
    return <FullScreen>
        <Container>
        <Row className={`mb-1 pt-4 pb-3 border-top border-bottom`}>
            <Col className={`pt-2`} xs={1}>
                <Link
                    to={{
                        state:env.organization,
                        pathname:`/organization/${env.organization.organizationUri}/environments`}}
                    style={{color : 'black'}} >
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={4} className={`border-right`}>
                <h3> <Icon.Cloud size={22}/> Environment <b className={`text-primary`}>{env.name}</b></h3>
            </Col>
            <Col xs={2} className={`pt-2 border-right`}>
                Role in Environment : <b className={`text-primary`}>{env.userRoleInEnvironment}</b>

            </Col>
            <Col xs={2} className={`pt-2`}>
                {env.region}
            </Col>
        </Row>
        <Row>
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
        </Row>
    </Container>
    </FullScreen>
}



export default EnvironmentPlayground;
