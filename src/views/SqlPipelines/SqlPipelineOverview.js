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


const SqlPipelineOverview = (props)=>{
    const sqlPipeline = props.sqlPipeline;

    return <Container className={`mt-4`}>

        <Row >
            <Col xs={1}>
                <Icon.InfoSquare/>
            </Col>
            <Col xs={2}>
                <b>Organization</b>
            </Col>
            <Col xs={8}>
                {sqlPipeline.organization&&sqlPipeline.organization.label}
            </Col>
        </Row>

        <Row >
            <Col xs={1}>
                <Icon.Cloud/>
            </Col>
            <Col xs={2}>
                <b>Aws</b>
            </Col>
            <Col xs={8}>
                {sqlPipeline.environment&&sqlPipeline.environment.AwsAccountId}
            </Col>
        </Row>
        <Row >
            <Col xs={1}>
                <Icon.Map/>
            </Col>
            <Col xs={2}>
                <b>Region</b>
            </Col>
            <Col xs={8}>
                {sqlPipeline.environment&&sqlPipeline.environment.region}
            </Col>
        </Row>

        <Row >
            <Col xs={1}>
                <Icon.CodeSquare/>
            </Col>
            <Col xs={2}>
                <b>Repository</b>
            </Col>
            <Col xs={8}>
                {sqlPipeline.cloneUrlHttp}
            </Col>
        </Row>
        <Row>
            <Col xs={1}>
                <Icon.Link45deg/>
            </Col>
            <Col xs={2}>
                Link
            </Col>
            <Col xs={8}>
                <a href={`https://${sqlPipeline.environment&&sqlPipeline.environment.region}.console.aws.amazon.com/codesuite/codecommit/repositories/${sqlPipeline.repo}/browse?region=${sqlPipeline.environment&&sqlPipeline.environment.region}`} target={`_blank`}>
                    CodeCommit
                </a>
            </Col>
        </Row>

    </Container>
}


export default SqlPipelineOverview;
