import React, {useState,useEffect} from "react";
import {Row, Col, Container,Button} from "react-bootstrap";
import styled from "styled-components";
import {If, Then,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import FullScreen from "../../components/FullScreen/Fullscreen";
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import {toast} from "react-toastify";
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import {
    BrowserRouter as Router,
    Route,
    Link ,
    Switch,
    useParams,
    useRouteMatch,
    useHistory
} from "react-router-dom";
import Tabs from "../../components/Tabs/Tabs";
import useClient from "../../api/client";
import getDatasetTable from "../../api/DatasetTable/getDatasetTable";
import startProfilingJob from "../../api/DatasetTable/startProfilingJob";
import getDatasetTableProfilingReport from "../../api/DatasetTable/getDatasetProfilingReport";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Styled= styled.div`
height:100vh;
width:125%;
z-index:999;
background-color: white;
margin-left: -25%;
margin-top: -25%;
overflow-y:auto;
overflow-x: auto;
scrollbar-color: lightblue white ;
scrollbar-width: thin;
  

&::-webkit-scrollbar
{
	width: 4px;
	padding-left: 1px;
	background-color: white;
}

&::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	background-color: lightblue;
}

`
const TableProfilingReport= (props)=>{
    let client =  useClient();
    let params=useParams();
    let [report, setReport] = useState()
    const fetchReport=async ()=>{
        const response = await client.query(getDatasetTableProfilingReport(params.jobUri));
        if (!response.errors){
            setReport(response.data.getDatasetTableProfilingReport)
        }else {
            toast(`Could not retrieve profiling report `);
        }
    }

    useEffect(()=>{
        if (client){
            fetchReport();
        }

    },[client,report])

    const getReport=()=>{
        return {__html: report};
    }
    return <Container>
        <Row>
            <Col xs={8}>
                <h4>Data Profiling Report</h4>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Styled>
                <div dangerouslySetInnerHTML={
                    getReport()
                }/>
                </Styled>
            </Col>
        </Row>

    </Container>
}


export default TableProfilingReport;
