import {Col, Row} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import React from "react";

const DatasetTableDescription =(props)=>{
    return <Row>
        <Col xs={12}>
            <ReactMarkdown children={props.markdown} />
        </Col>
    </Row>
}


export default DatasetTableDescription;
