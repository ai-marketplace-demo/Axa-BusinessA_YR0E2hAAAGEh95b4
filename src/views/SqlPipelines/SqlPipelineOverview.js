import React, { useEffect, useState } from 'react';
import {
    Col, Row, Container, Spinner, Tabs, Tab
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import { useParams, useHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import MainActionButton from '../../components/MainActionButton/MainButton';
import useClient from '../../api/client';
import SqlPipelineListItem from './SqlPipelineListItem';
import getSqlPipeline from '../../api/SqlPipeline/getSqlPipeline';
import getSqlPipelineDag from '../../api/SqlPipeline/getSqlPipelineDag';


const SqlPipelineOverview = (props) => {
    const { sqlPipeline } = props;
    const client = useClient();
    const [dag, setDag] = useState(null);

    const fetchDag = async () => {
        const response = await client.query(getSqlPipelineDag(sqlPipeline.sqlPipelineUri));
        if (!response.errors) {
            setDag(response.data.getSqlPipelineDag);
        } else {
            toast(`Could not retrieve dag, received error ${response.errors[0].message}`);
        }
    };


    useEffect(() => {
        if (client) {
            // fetchDag();
        }
    });
    return (
        <Container className={'mt-4'}>

            <Row>
                <Col xs={1}>
                    <Icon.InfoSquare />
                </Col>
                <Col xs={2}>
                    <b>Organization</b>
                </Col>
                <Col xs={8}>
                    {sqlPipeline.organization && sqlPipeline.organization.label}
                </Col>
            </Row>

            <Row>
                <Col xs={1}>
                    <Icon.Cloud />
                </Col>
                <Col xs={2}>
                    <b>AWS</b>
                </Col>
                <Col xs={8}>
                    {sqlPipeline.environment && sqlPipeline.environment.AwsAccountId}
                </Col>
            </Row>
            <Row>
                <Col xs={1}>
                    <Icon.Map />
                </Col>
                <Col xs={2}>
                    <b>Region</b>
                </Col>
                <Col xs={8}>
                    {sqlPipeline.environment && sqlPipeline.environment.region}
                </Col>
            </Row>

            <Row>
                <Col xs={1}>
                    <Icon.CodeSquare />
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
                    <Icon.Link45deg />
                </Col>
                <Col xs={2}>
                    Link
                </Col>
                <Col xs={8}>
                    <a href={`https://${sqlPipeline.environment && sqlPipeline.environment.region}.console.aws.amazon.com/codesuite/codecommit/repositories/${sqlPipeline.repo}/browse?region=${sqlPipeline.environment && sqlPipeline.environment.region}`} target={'_blank'}>
                        CodeCommit
                    </a>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <If condition={dag}>
                        <Then>
                            <code>
                                {/** dag* */}
                            </code>
                        </Then>
                    </If>
                </Col>
            </Row>

        </Container>
    );
};


export default SqlPipelineOverview;
