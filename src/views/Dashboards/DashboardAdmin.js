import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Spinner,Tabs,Tab} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import {useParams, useHistory} from "react-router";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import MainActionButton from "../../components/MainActionButton/MainButton";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import searchDashboards from "../../api/Dashboard/searchDashboards";
import {toast} from "react-toastify";
import DashboardListItem from "./DashboardListItem";
import dayjs from "dayjs";
import getDashboard from "../../api/Dashboard/getDashboard";
import EnvironmentOverview from "../EnvironmentPlayground/EnvironmentOverview";
import QuicksightDesigner from "./QuicksightDesigner";
import DashboardOverview from "./DashboardOverview";


const FullScreen = styled.div`
height: 120vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}\`

`

const DashboardAdmin = (props)=>{
    const client = useClient()
    const params = useParams();
    const [ready,setReady]= useState(false);
    const [key, setKey] = useState("Overview");
    const [dashboard, setDashboard] = useState({})
    useEffect(()=>{
        if (client){
            client
                .query(getDashboard(params.uri))
                .then((res)=>{
                    if (!res.errors){
                        setDashboard(res.data.getDashboard);
                        setReady(true);
                    }else {
                        toast.error(`Could not retrieve dashboard, received ${res.errors[0].message}`,{hideProgressBar:true})
                    }
                })
                .catch((err)=>{
                    toast.error(`Unexpected error${err.message}`,{hideProgressBar:true})

                })
        }

    },[client]);

    const OverviewTitle=()=>{

    }
    return <FullScreen>
        <Container>
            <Row className={"m-0 border-top border-bottom"}>
                <Col className="pt-3" xs={1}>
                    <Icon.ClipboardData size={32}/>
                </Col>
                <Col className={"border-right pt-1"} xs={8}>
                    <Row className={"m-0"}>
                        <Col xs={8}>
                            <h4>Dashboard <b className={`text-primary`}>{dashboard.label}</b></h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8}>
                            <p>Created by <a href={"#"}>{dashboard.owner}</a> {dayjs(dashboard.created).fromNow()} </p>
                        </Col>

                    </Row>

                </Col>
                <Col className={`border-right pt-1`} xs={2}>
                    Role in Dashboard : <b className={`text-primary`}> {dashboard.userRoleInDashboard}</b>
                </Col>

            </Row>

            <Row className={`mt-4`}>
                <Col xs={12}>
                    <Tabs
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                    >
                        <Tab eventKey="Overview" title={'Overview'}>
                            <If condition={key=='Overview'}>
                                <Then>
                                    <DashboardOverview dashboard={dashboard}/>
                                </Then>
                            </If>
                        </Tab>

                        <Tab eventKey="Design" title="View">
                            <If condition={key=="Design"}>
                                <Then>
                                    <QuicksightDesigner/>
                                </Then>
                            </If>
                        </Tab>
                        <Tab eventKey="Shares" title="Shares">
                            <h1>Shares</h1>
                        </Tab>

                    </Tabs>

                </Col>
            </Row>

        </Container>
    </FullScreen>
}


export default DashboardAdmin ;
