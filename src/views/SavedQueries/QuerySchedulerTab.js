import React, {useRef, useState} from "react";
import {If, Then, Else} from "react-if";
import {Container, Row, Col,Spinner,Badge} from "react-bootstrap";
import {Case} from "react-if";
import Editor from "@monaco-editor/react";
import * as Icon from "react-bootstrap-icons";
import {toast} from "react-toastify";
import updateSavedQuery from "../../api/SavedQuery/updateSavedQuery";
import removeSavedQuery from "../../api/SavedQuery/removeSavedQuery";
import getScheduledQuery from "../../api/SavedQuery/getScheduledQuery";
import ReactTooltip from 'react-tooltip';
import runSavedQuery from "../../api/SavedQuery/runSavedQuery";
import ResultTable from "./ResultTable";

const QuerySchedulerTab = (props)=>{
    const [query ,setQuery]= useState(props.query);
    const [op, setOp] = useState(false);


    const updateThisQuery=async ()=>{
        setOp(true);

        setOp(false);
    }



    return <Container className={`mt-4`} fluid>

        <Row>
            <Col xs={12}>
                <h4>Cron expression</h4>
            </Col>
            <Col xs={12}>
                <input value={query.cronexpr} className={`form-control`}/>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>
                <div className={`btn-sm btn btn-primary rounded-pill`}>
                    Save
                </div>
            </Col>
            <Col xs={2}>
                <div className={`btn-sm  btn btn-secondary rounded-pill`}>
                    Cancel
                </div>
            </Col>

        </Row>
    </Container>
}


export default QuerySchedulerTab;
