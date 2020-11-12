import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {Case} from "react-if";



const QueryOverviewTab = (props)=>{
    const query = props.query;
    return   <div style={{marginTop:'4ch', paddingLeft :'2ch', borderLeft:'lightgrey 2px solid'}}>
        <Row>
            <Col xs={1}>
                <b>Name</b>
            </Col>
            <Col xs={8}>
                {query.label}
            </Col>
        </Row>
        <Row>
            <Col xs={1}>
                <b>Description</b>
            </Col>
            <Col xs={8}>
                {query.description}
            </Col>
        </Row>
        <Row>
            <Col xs={1}>
                <b>Created by</b>
            </Col>
            <Col xs={8}>
                {query.owner}
            </Col>
        </Row>
        <Row>
            <Col xs={1}>
                <b>Created </b>
            </Col>
            <Col xs={8}>
                {query.created}
            </Col>
        </Row>
    </div>

}


export default QueryOverviewTab;
