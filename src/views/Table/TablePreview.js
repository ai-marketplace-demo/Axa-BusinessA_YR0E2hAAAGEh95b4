import React, {useState,useEffect} from "react";
import {Row, Col, Container,Button} from "react-bootstrap";
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
import previewTable from "../../api/DatasetTable/previewTable";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const TablePreview = (props)=>{
    let client =  useClient();


    let [response, setResponse]= useState({status:null, queryUri:null});
    let [attempt, setAttempt] = useState(0);

    useEffect(()=>{
        if (client){
            if (props.table.tableUri){
                if (!response.queryExecutionId){
                    client
                        .query(previewTable({tableUri:props.table.tableUri}))
                        .then((response)=>{
                            if (!response.errors){
                                setResponse({...response.data.previewTable});
                            }else {
                                toast.error(`${response.errors[0].message}`)
                            }
                        })
                        .catch((err)=>{
                            toast.error(`${response.error.message} !!!!`)
                        })
                }else {
                    if (attempt<10){

                        if(response.status!='FAILED'&response.status!='SUCCEEDED'){
                            client
                                .query(previewTable({
                                    queryExecutionId:response.queryExecutionId,
                                    tableUri:props.table.tableUri}))
                                .then((response)=>{
                                    setResponse({...response.data.previewTable});
                                })
                                .catch((err)=>{

                                })
                                .finally(()=>{
                                    setTimeout(()=>{
                                        setAttempt(attempt+1);
                                    },1000)
                                })
                        }
                    }else {
                        setResponse({...response, status:'failed',reason:'too many attemps'})
                    }
                }

            }

        }
    },[client,attempt,response.queryUri,props.table.tableUri])


    return <Container>
        <Row>
            <Col xs={12}>
                <h5> Preview of table {props.table.GlueTableName}</h5>
            </Col>
        </Row>
        <Row>
            <Col>
                {response.queryExecutionId}
            </Col>
            <Col>
                {response.status}
            </Col>
            <Col>
                {attempt}
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                {
                    (response.count)?(
                        <div>
                            <HotTable
                                licenseKey={'non-commercial-and-evaluation'}
                                data={response.nodes.map((record)=>{return Object.values(JSON.parse(record.data))})} colHeaders={false} rowHeaders={true} width="600" height="300" />
                        </div>

                    ):(
                        <div>pending</div>
                    )
                }
            </Col>
        </Row>
    </Container>
}


export default TablePreview;
