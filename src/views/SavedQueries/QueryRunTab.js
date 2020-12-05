import React, {useRef, useEffect,useState} from "react";
import {If, Then, Else} from "react-if";
import {Container, Row, Col,Spinner,Badge} from "react-bootstrap";
import {Case} from "react-if";
import Editor from "@monaco-editor/react";
import * as Icon from "react-bootstrap-icons";
import {toast} from "react-toastify";
import runScheduledQuery from "../../api/SavedQuery/runScheduledQuery";
import listScheduledQueryExecutions from "../../api/SavedQuery/listScheduledQueryExecutions";

const QueryRunTab= (props)=>{
    const [op, setOp] = useState(false);
    const client = props.client;
    const [executions, setExecutions] = useState([]);
    const start= async()=>{
        const response = await client.mutate(runScheduledQuery(props.query.scheduledQueryUri));
    }



    const list_runs=async()=>{
        const response  = await client.query(listScheduledQueryExecutions(props.query.scheduledQueryUri));
        if (!response.errors){
            setExecutions(response.data.listScheduledQueryExecutions);
        }else {
            toast(`Error`)
        }
    }


    useEffect(()=>{
        list_runs()
    });

    return <Container className={`mt-4`} fluid>
        <Row>
            <Col xs={2}>
                <div onClick={start} className={`btn btn-sm rounded-pill btn-info`}>
                    Run Now
                </div>
            </Col>
        </Row>
        <Row>
            <table className={`table`}>
                <thead>
                <tr>
                    <th>
                        id
                    </th>
                    <th>
                        status
                    </th>
                    <th>
                        started
                    </th>
                    <th>
                        completed
                    </th>
                </tr>
                </thead>
                <If condition={executions.length}>
                    <Then>

                    </Then>
                    <Else>
                        <i>No executions found.</i>
                    </Else>

                </If>
            </table>
        </Row>
    </Container>
}


export default QueryRunTab;
