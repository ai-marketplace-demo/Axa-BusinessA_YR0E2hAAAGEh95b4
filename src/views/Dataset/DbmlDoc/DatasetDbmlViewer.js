import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";


const DmblViewer = function(props){
    return <Container>
        <Row>
            <Col xs={4}>
                Tables
            </Col>
            <Col xs={8}>
                Body
            </Col>
        </Row>
    </Container>
}



export default DmblViewer;
