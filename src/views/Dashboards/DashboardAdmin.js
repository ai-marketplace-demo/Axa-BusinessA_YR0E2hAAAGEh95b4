import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Spinner,Tabs,Tab} from "react-bootstrap";
import {If, Then, Else,Switch, Case, Default} from "react-if";
import {useParams, useHistory} from "react-router";
import * as Icon from  "react-bootstrap-icons";
import * as MdIcon  from 'react-icons/md';
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
import DashboardShares from "./DashboardShares";
import RoutedTabs from "../../components/Tabs/Tabs";
import getReaderSession from "../../api/Dashboard/getDashboardReaderSession";


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
    const [dashboard, setDashboard] = useState({
        readerUrl : null
    });
    const [sessionUrl, setSessionUrl] = useState(null);

    const tabs=[
        "overview",
        "display",
        "share"
    ];

    const fetchReaderSessionUrl= async ()=>{
        if (!sessionUrl){
            toast.info(`Retrieving session url for dashboard ${params.uri}`);
            const response = await client.query(getReaderSession(params.uri));
            toast.info("Got url");
            console.log("Received",response);
            if (!response.errors){

                setSessionUrl(response.data.getReaderSession);

            }else {
                toast.error(`Failed to retrieve session url`)//, received ${response.errors[0].message}`);
            }
        }
        setReady(true);
    }

    const fetchDashboard = async()=>{
        const response = await client.query(getDashboard(params.uri));
        if (!response.errors){
            setDashboard(response.data.getDashboard);
        }else {
            toast.error(`Unexpected error${response.errors[0].message}`,{hideProgressBar:true})
        }

    }

    useEffect(()=>{
        if (client){
            fetchDashboard();
            fetchReaderSessionUrl();
        }
    },[client]);




    return <Container fluid className={`mt-3`}>
            <Row className={"m-0 border"}>
                <Col className="pt-3" xs={1}>
                    <MdIcon.MdShowChart size={32}/>
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
            <Row className={`mt-3`}>
                <Col xs={12}>
                    <RoutedTabs tabs={tabs}/>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Switch>
                        <Case condition={params.tab=="display"}>
                            <QuicksightDesigner
                                dashboard={dashboard}
                                sessionUrl={sessionUrl}
                                //fetchUrl={fetchReaderSessionUrl}
                            />
                        </Case>
                        <Case condition={params.tab=="share"}>
                            <DashboardShares
                                dashboard={dashboard}
                            />
                        </Case>
                        <Default>
                            <DashboardOverview dashboard={dashboard}/>
                        </Default>
                    </Switch>
                </Col>
            </Row>
        </Container>
}


export default DashboardAdmin ;
