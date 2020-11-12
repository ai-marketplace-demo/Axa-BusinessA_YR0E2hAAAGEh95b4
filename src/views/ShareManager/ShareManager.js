import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Tabs,Tab,Badge,Dropdown} from "react-bootstrap";
import {If, Then, Switch, Case, Default,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {useParams} from "react-router-dom";
import useClient from "../../api/client";
import styled from "styled-components";
import getShareObject from "../../api/ShareObject/getShareObject";
import {toast} from "react-toastify";
import General from "./General";
import SharedItemList from "./SharedItemList";
import NotSharedItemList from "./NotSharedItemList";

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
        return <Container fluid className={`mt-2`}>
            <Row>
                <Col xs={12}>
                    <Spinner variant={`primary`} animation={`border`}/>
                </Col>
            </Row>
        </Container>
    }

    return <Container fluid>


        <Row className={`mt-4`}>
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
        </Row>

        <Row className={`mt-2`}>
            <Col className={`mt-2`} xs={12}>
                <Switch>
                    <Case condition={tabKey=="general"}>
                        <If condition={share.dataset}>
                            <Then>
                                <General share={share}/>
                            </Then>
                        </If>
                    </Case>
                    <Case condition={tabKey=="current"}>
                        <SharedItemList fetch={fetchShare} share={share}/>
                    </Case>
                    <Case condition={tabKey=="more"}>
                        <NotSharedItemList fetch={fetchNotSharedItems} share={share}/>
                    </Case>
                </Switch>

            </Col>
        </Row>
    </Container>
}



export default ShareManager;
