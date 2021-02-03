import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Tabs,Tab,Badge,Dropdown} from "react-bootstrap";
import {If, Then, Switch, Case, Default,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {useParams} from "react-router-dom";
import useClient from "../../api/client";
import styled from "styled-components";
import getShareObject from "../../api/ShareObject/getShareObject";
import {toast} from "react-toastify";
import RoutedTabs from "../../components/Tabs/Tabs";
import General from "./General";
import SharedItemList from "./SharedItemList";
import NotSharedItemList from "./NotSharedItemList";
import Loader from "react-loaders";
import FormSection from "../../components/FormSection/FormSection";

const Theme=styled.div`
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}
`

const ShareManager = (props)=>{
    const client= useClient();
    const params = useParams();
    const shareUri = params.shareUri;
    const [share, setShare]=useState({items:{count:0, page:1,pages:1,nodes:[]}});
    const [notSharedItems, setNotSharedItems]=useState({count:0, page:1,pages:1,nodes:[]});
    const [tabKey, setTabKey] = useState('general');

    const tabs=["general","current","more"]

    const fetchShare=async ()=>{
        const response = await client.query(getShareObject ({shareUri:params.shareUri,filter:{isShared:true}}));
        if (!response.errors){
            setShare(response.data.getShareObject);
        }else {
            toast(`Could not retrieve details for share, received ${response.errors[0].message}`)
        }
    }

    const fetchNotSharedItems = async(term)=>{
        const response = await client.query(getShareObject ({shareUri:params.shareUri,filter:{term:term||"",isShared:false}}));
        if (!response.errors){
            setNotSharedItems({...response.data.getShareObject.items});
        }else {
            toast(`Could not retrieve not shared items for share, received ${response.errors[0].message}`)
        }
    }

    useEffect(()=>{
        if (client){
            fetchShare();
        }
    },[client]);


    if (!share.status){
        return <Container>
            <Row>
                <Col style={{marginTop: '21%', marginLeft:'43%'}} xs={4}>
                    <Loader color={`lightblue`} type="ball-scale-multiple" />
                </Col>
            </Row>
        </Container>
    }

    return <Container fluid>

        <Row style={{
            borderBottom:'1px lightgrey solid',
            borderRight:'1 solid white',
            //borderBottomRightRadius:"23px",
            boxShadow:'0px 7px 2px rgb(0,0,0,0.04)',
        }}
             className={"mt-3    "}>
            <Col    xs={1}>
                <Icon.Reply size={32}/>
            </Col>
            <Col    xs={10}>
                <h4>Permissions on <Icon.Folder/> <b className={`text-info`}>{share.dataset.datasetName}</b> </h4>
                <h4>to <Icon.People/> <b className={`text-info`}>{share.principal.principalName}</b> </h4>
                <h5>{share.principal.AwsAccountId}:{share.principal.region} <Icon.Cloud/></h5>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <RoutedTabs tabs={tabs}/>
            </Col>
            {/**
            <Col xs={12}>
                <Theme>
                <Tabs
                    activeKey={tabKey}
                    onSelect={(k) => setTabKey(k)}
                >
                    <Tab eventKey="general" title="General"></Tab>
                    <Tab eventKey="current" title="Current Grants"></Tab>
                    <Tab eventKey="more" title="Add More"></Tab>
                </Tabs>
                </Theme>
            </Col>
             **/}
        </Row>

        <Row className={`mt-2`}>
            <Col className={`mt-2`} xs={12}>
                <Switch>
                    <Case condition={params.tab=="general"}>
                        <If condition={share.dataset}>
                            <Then>
                                <General share={share}/>
                            </Then>
                        </If>
                    </Case>
                    <Case condition={params.tab=="current"}>
                        <SharedItemList fetch={fetchShare} share={share}/>
                    </Case>
                    <Case condition={params.tab=="more"}>
                        <NotSharedItemList fetch={fetchNotSharedItems} share={share}/>
                    </Case>
                </Switch>

            </Col>
        </Row>
    </Container>
}



export default ShareManager;
