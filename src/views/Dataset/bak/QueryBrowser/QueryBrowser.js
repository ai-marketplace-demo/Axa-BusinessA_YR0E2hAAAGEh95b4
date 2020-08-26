import React ,{useState} from "react";
import {Row, Col, Container} from "react-bootstrap";
import QueryListPanel from "./QueryList";
import QueryEditor from "./QueryEditor";
import styled from "styled-components";


const QueryBrowser= (props)=>{
    return <Container className={"m-0 p-0"}>
        <Row>
            <Col className={"mt-4"} xs={2}>
                <QueryListPanel/>
            </Col>
            <Col xs={10}>
                <QueryEditor/>
            </Col>
        </Row>
    </Container>
}

export default QueryBrowser;
