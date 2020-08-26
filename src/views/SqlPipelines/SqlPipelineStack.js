import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Spinner,Tabs,Tab} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import {useParams, useHistory} from "react-router";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import MainActionButton from "../../components/MainActionButton/MainButton";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import {toast} from "react-toastify";
import SqlPipelineListItem from "./SqlPipelineListItem";
import dayjs from "dayjs";
import getSqlPipeline from "../../api/SqlPipeline/getSqlPipeline";


const SqlPipelineStack = (props)=>{
    const sqlPipeline = props.sqlPipeline;

    return <Container className={`mt-4`}>

        <Row >
            <Col xs={1}>
                <Icon.InfoSquare/>
            </Col>
            <Col xs={2}>
                <b>Cloudformation Stack</b>
            </Col>
            <Col xs={8}>
                {sqlPipeline.stack&&sqlPipeline.stack.stackid}
            </Col>
        </Row>
        <Row >
            <Col xs={1}>
                <Icon.Link/>
            </Col>
            <Col xs={2}>
                <b>Console Link</b>
            </Col>
            <Col xs={8}>
                <a href={sqlPipeline.stack&&sqlPipeline.stack.link} target={`_blank`}>{sqlPipeline.stack&&sqlPipeline.stack.stackid}</a>
            </Col>
        </Row>
        <Row >
            <Col xs={1}>
                <Icon.Circle/>
            </Col>
            <Col xs={2}>
                <b>Status</b>
            </Col>
            <Col xs={8}>
                {sqlPipeline.stack&&sqlPipeline.stack.status}
            </Col>
        </Row>



    </Container>
}


export default SqlPipelineStack ;
