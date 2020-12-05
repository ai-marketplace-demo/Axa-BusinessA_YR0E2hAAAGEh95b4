import React, {useState, useEffect} from "react";
import {Container, Spinner,Row,Col,Tabs,Tab} from "react-bootstrap";
import Loader from 'react-loader-spinner'
import * as Icon from "react-bootstrap-icons";
import {If,Then,Else, Switch, Case,Default} from "react-if";
import useClient from "../../api/client";
import getDataset from "../../api/Dataset/getDataset";
import {useParams} from "react-router-dom";
import RoutableTabs from "../../components/Tabs/Tabs";
import DatasetTables from "./DatasetTables/DatasetTables";
import DatasetOverview from "./DatasetOverview/DatasetOverview";
import DatasetDetails  from "./DatasetDetails/DatasetDetails2";
import DatasetSummary  from "./DatasetSummary/DatasetSummary";
import DatasetFolderList  from "./DatasetFolders/DatasetFolderList";
import DatasetShareList  from "./DatasetShares/DatasetShareList";
import DatasetUpload  from "./DatasetUpload/DatasetUpload";
import styled from "styled-components";



const DatasetAdminView = (props)=>{
    const client= useClient();
    let params= useParams();
    let [info,setInfo] = useState({});
    let [canEdit, setCanEdit] = useState(false);
    let [ready, setReady] = useState(false);
    const [key, setKey] = useState(params.tab||'overview');


    const fetchDataset=async ()=>{
        const response = await client.query(getDataset(params.uri))
        if (!response.errors){
            setInfo(response.data.getDataset);
            setReady(true);
            setCanEdit(['Creator','Admin'].indexOf(response.data.getDataset.userRoleForDataset)!=-1)
        }
    }


    useEffect(()=>{
        if (client){
            fetchDataset();
        }
    },[client,params.tab])

    if (!ready){
        return <Container>
            <Row>
                <Col xs={4}>
                    <Spinner variant={`info`} animation={`border`}/>

                </Col>
            </Row>
        </Container>
    }
    return <Container
        __style={{
            marginTop:'1rem',
            borderTop:'1px lightgrey solid',
            borderLeft:'1px lightgrey solid',
            borderRight:'1px lightgrey solid',
            borderTopLeftRadius:'12px ',
            borderTopRightRadius:'12px ',
            boxShadow:' 0px -5px 5px  #f7f7f7',
            //backgroundColor:'#f7f7f7',
        }}
        fluid>
        <Row
             className={"mt-3    "}>
            <Col className="pt-4" xs={1}>
                <Icon.Folder size={32}/>
            </Col>
            <Col className={`border-right pt-3`} xs={4}>
                <Row>
                    <h4>{info.label}</h4>
                </Row>
                <Row>
                    <p>by <a href={"#"}>{info.owner}</a></p>
                </Row>

            </Col>
            <Col className={`border-right pt-3`} xs={2}>
                Role for dataset : <b className={`text-primary`}>{info.userRoleForDataset}</b>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={12}>
                <RoutableTabs
                    tabs={['overview','summary','details','tables',"folders",'shares',"upload",'integrations']}
                />
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col className={`pl-1 `} xs={12}>
            <Switch>
                <Case condition={params.tab==`tables`}>
                    <If condition={ready}>
                        <Then>
                           <DatasetTables dataset={info}/>
                        </Then>
                    </If>
                </Case>
                <Case condition={params.tab==`folders`}>
                    <DatasetFolderList dataset={info}/>
                </Case>
                <Case condition={params.tab==`shares`}>
                    <DatasetShareList dataset={info}/>
                </Case>
                <Case condition={params.tab==`details`}>
                    <If condition={ready}>
                        <Then>
                            <DatasetDetails dataset={info}/>
                        </Then>
                    </If>
                </Case>
                <Case condition={params.tab==`summary`}>
                    <If condition={ready}>
                        <Then>
                            <DatasetSummary dataset={info}/>
                        </Then>
                    </If>
                </Case>
                <Case condition={params.tab==`upload`}>
                    <DatasetUpload dataset={info}/>
                </Case>

                <Case condition={params.tab==`integrations`}>
                    <h2>Integrations</h2>
                </Case>
                <Default>
                    <If condition={ready}>
                        <Then>
                            <DatasetOverview dataset={info}/>
                        </Then>
                    </If>
                </Default>
            </Switch>
            </Col>
        </Row>
    </Container>
}


export default DatasetAdminView;
