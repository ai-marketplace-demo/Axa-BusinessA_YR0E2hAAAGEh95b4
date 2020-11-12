import React, {useState,useEffect}  from "react";
import {Container, Row, Spinner,Col} from "react-bootstrap";
import {If, Then, Else,Switch,Case,Default} from "react-if";
import * as Icon from "react-bootstrap-icons";
import ReactMarkdown from 'react-markdown';
import DatasetTableColumns from "./DatasetTableColumns";
import DatasetTableDescription from "./DatasetTableDescription";
import DatasetTablePreview from "./DatasetTablePreview";
import listDatasetTables from "../../../api/Dataset/listDatasetTables";
import syncTables from "../../../api/Dataset/syncTables";
import useClient from "../../../api/client";
import {toast} from "react-toastify";


const DescriptionTab =(props)=>{
    return <Row>
        <Col xs={12}>
            <ReactMarkdown children={props.markdown} />
        </Col>
    </Row>
}




const DatasetTableUploadForm=(props)=>{
    const client = useClient();

    useEffect(()=>{
        if (client){
        }
    },[client]);



    return <Container className={`mt-4`} fluid>

        <Row>
            <Col xs={12}>

            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <div onClick={props.close} className={`btn btn-sm btn-secondary rounded-pill`}>
                    Cancel
                </div>
            </Col>
        </Row>

    </Container>
}

export default DatasetTableUploadForm;
