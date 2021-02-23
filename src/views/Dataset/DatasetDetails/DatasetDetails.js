import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import * as Icon from 'react-bootstrap-icons';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import styled from 'styled-components';
import Zoom from '../../../components/Zoomer/Zoom';
import useClient from '../../../api/client';
import getDataset from '../../../api/Dataset/getDataset';
import generateDatasetAccessToken from '../../../api/Dataset/generateDatasetAccessToken';
import getDatasetAdminConsoleUrl from '../../../api/Dataset/getDatasetAdminConsoleUrl';
import getDatasetETLCredentials from '../../../api/Dataset/getDatasetETLCredentials';
import FormSection from '../../../components/FormSection/FormSection';


const DatasetDetails = (props) => {
    const client = useClient();
    const copy = (field) => {
        toast(`Copied ${field} to clipboard`, { hideProgressBar: true });
    };

    const [credentials, setCredentials] = useState();
    const [consoleUrl, setConsoleUrl] = useState();
    const [etlCredentials, setEtlCredentials] = useState();
    const [loading, setLoading] = useState(false);
    const [isLoadingConsoleUrl, setIsLoadingConsoleUrl] = useState(false);
    const [isLoadingETLCredentials, setIsLoadingETLCredentials] = useState(false);

    const generateCredentials = async () => {
        setLoading(true);
        const response = await client.mutate(generateDatasetAccessToken(props.dataset.datasetUri));

        if (!response.errors) {
            setCredentials(response.data.generateDatasetAccessToken);
        } else {
            toast(`Could not retrieve Access Token, received ${response.errors[0].message}`);
        }
        setLoading(false);
    };

    const generateETLCredentials = async () => {
        setIsLoadingETLCredentials(true);
        const response = await client.query(getDatasetETLCredentials(props.dataset.datasetUri));

        if (!response.errors) {
            toast(`${response.data.getDatasetETLCredentials}`);
            setEtlCredentials(response.data.getDatasetETLCredentials);
        } else {
            toast(`Could not retrieve ETL credentials, received ${response.errors[0].message}`);
        }
        setIsLoadingETLCredentials(false);
    };

    const generateRedirectUrl = async () => {
        setIsLoadingConsoleUrl(true);
        const response = await client.query(getDatasetAdminConsoleUrl(props.dataset.datasetUri));

        if (!response.errors) {
            setConsoleUrl(response.data.getDatasetAssumeRoleUrl);
        } else {
            toast(`Could not retrieve URL , received ${response.errors[0].message}`);
        }
        setIsLoadingConsoleUrl(false);
    };

    useEffect(() => {}, [client]);

    return (
        <Container className={'mt-4'}>

            <Row>
                <Col xs={3}>
                    <b>AWS Account Id</b>
                </Col>
                <Col xs={6}>
                    {props.dataset.AwsAccountId}
                </Col>
                <Col xs={2}>
                    <Zoom color={'black'}>
                        <CopyToClipboard text={props.dataset.AwsAccountId}>
                            <Icon.Clipboard onClick={() => { copy('AwsAccountId'); }} className={'ml-2'} />
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Region</b>
                </Col>
                <Col xs={6}>
                    {props.dataset.region}
                </Col>
                <Col xs={2}>
                    <Zoom color={'black'}>
                        <CopyToClipboard text={props.dataset.region}>
                            <Icon.Clipboard onClick={() => { copy('Region'); }} className={'ml-2'} />
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Cloudformation Stack</b>
                </Col>
                <Col xs={6}>
                    <code> {props.dataset.stack.stackid}</code>
                </Col>
                <Col xs={2}>
                    <Zoom color={'black'}>
                        <CopyToClipboard text={props.dataset.stack.stackid}>
                            <Icon.Clipboard onClick={() => { copy('CFNID'); }} className={'ml-2'} />
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Cloudformation Stack Status</b>
                </Col>
                <Col xs={6}>
                    <Badge pill> {props.dataset.stack.status}</Badge>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Cloudformation Link</b>
                </Col>
                <Col xs={6}>
                    <a target={'_blank'} href={props.dataset.stack.link}>Console</a>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>S3 Bucket Name</b>
                </Col>
                <Col xs={6}>
                    <code> {props.dataset.S3BucketName}</code>
                </Col>
                <Col xs={2}>
                    <Zoom color={'black'}>
                        <CopyToClipboard text={props.dataset.S3BucketName}>
                            <Icon.Clipboard onClick={() => { copy('S3BucketName'); }} className={'ml-2'} />
                        </CopyToClipboard>
                    </Zoom>
                </Col>

            </Row>
            <Row>
                <Col xs={3}>
                    <b>S3 Bucket Arn</b>
                </Col>
                <Col xs={6}>
                    <code> arn:aws:s3:::{props.dataset.S3BucketName}</code>
                </Col>
                <Col xs={2}>
                    <Zoom color={'black'}>
                        <CopyToClipboard text={`arn:aws:s3:::${props.dataset.S3BucketName}`}>
                            <Icon.Clipboard onClick={() => { copy('Bucket Arn'); }} className={'ml-2'} />
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>GlueDatabaseName</b>
                </Col>
                <Col xs={6}>
                    <code>{props.dataset.GlueDatabaseName}</code>
                </Col>
                <Col xs={2}>
                    <Zoom color={'black'}>
                        <CopyToClipboard text={props.dataset.GlueDatabaseName}>
                            <Icon.Clipboard onClick={() => { copy('Glue Databse Name'); }} className={'ml-2'} />
                        </CopyToClipboard>

                    </Zoom>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>IAM Role Arn</b>
                </Col>
                <Col xs={6}>
                    <code>{props.dataset.IAMDatasetAdminRoleArn}</code>
                </Col>
                <Col xs={2}>
                    <Zoom color={'black'}>
                        <CopyToClipboard text={props.dataset.IAMDatasetAdminRoleArn}>
                            <Icon.Clipboard onClick={() => { copy('IAM Dataset Admin Role'); }} className={'ml-2'} />
                        </CopyToClipboard>
                    </Zoom>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col className={'mt-2'} xs={3}>
                    <b>Connect</b>
                </Col>
                <Col xs={4}>
                    <div style={{ width: '100%' }} onClick={generateCredentials} className={'p-1 btn btn-primary'}> Generate Credentials</div>
                </Col>
                <Col xs={2} />
                <Col xs={2}>
                    {
                        (loading) ? (
                            <Spinner size={'sm'} variant={'primary'} animation={'grow'} />
                        ) : (
                            (credentials) ? (
                                <Zoom color={'black'}>
                                    <CopyToClipboard text={credentials}>
                                        <Icon.Clipboard onClick={() => { copy('Credentials'); }} className={'ml-2'} />
                                    </CopyToClipboard>
                                </Zoom>
                            ) : (
                                <div className={'text-warning'}> </div>
                            )
                        )
                    }
                </Col>

            </Row>
            <Row className={'mt-1'}>
                <Col className={'mt-2'} xs={3}>
                    <b>Jump to console</b>
                </Col>
                <Col xs={4}>
                    <div style={{ width: '100%' }} onClick={generateRedirectUrl} className={'p-1 btn btn-primary'}> Generate Url</div>
                </Col>
                <Col xs={2} />
                <Col xs={3}>
                    {
                        (isLoadingConsoleUrl) ? (
                            <Spinner size={'sm'} variant={'primary'} animation={'grow'} />
                        ) : (
                            (consoleUrl) ? (
                                <a target={'_blank'} href={consoleUrl}>
                                    <Icon.Arrow90degRight /> AWS Console
                                </a>
                            ) : (
                                <div className={'text-warning'}> </div>
                            )
                        )
                    }
                </Col>

            </Row>
            <Row className={'mt-1'}>
                <Col className={'mt-2'} xs={3}>
                    <b>Configure ETL </b>
                </Col>
                <Col xs={4}>
                    <div style={{ width: '100%' }} onClick={generateETLCredentials} className={'p-1 btn btn-warning'}> Generate Permanent Credentials</div>
                </Col>
                <Col xs={2} />
                <Col xs={3}>
                    {
                        (isLoadingETLCredentials) ? (
                            <Spinner size={'sm'} variant={'primary'} animation={'grow'} />
                        ) : (
                            (etlCredentials) ? (
                                <Zoom color={'black'}>
                                    <CopyToClipboard text={etlCredentials}>
                                        <Icon.Clipboard onClick={() => { copy('ETL Credentials'); }} className={'ml-2'} />
                                    </CopyToClipboard>
                                </Zoom>

                            ) : (
                                <div className={'text-warning'}> </div>
                            )
                        )
                    }
                </Col>

            </Row>


        </Container>
    );
};


export default DatasetDetails;
