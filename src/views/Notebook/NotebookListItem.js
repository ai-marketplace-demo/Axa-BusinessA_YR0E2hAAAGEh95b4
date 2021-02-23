import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Badge, Spinner, Table
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import BasicCard from '../../components/Card/BasicCard';
import getSagemakerNotebookPresignedUrl from '../../api/SagemakerNotebook/getSagemakerNotebookPresignedUrl';
import stopSagemakerNotebook from '../../api/SagemakerNotebook/stopNotebookInstance';
import startSagemakerNotebook from '../../api/SagemakerNotebook/startNotebookInstance';


const Body = (props) => {
    const [url, setUrl] = useState('');
    const getThisNotebookPresignedUrl = async () => {
        const response = await props.client.query(getSagemakerNotebookPresignedUrl(props.notebook.notebookUri));
        if (!response.errors) {
            setUrl(response.data.getSagemakerNotebookPresignedUrl);
        }
    };
    const stopThisNotebook = async () => {
        const response = await props.client.query(stopSagemakerNotebook(props.notebook.notebookUri));
    };

    const startThisNotebook = async () => {
        const response = await props.client.query(startSagemakerNotebook(props.notebook.notebookUri));
    };
    return (
        <div className={'mt-3'}>
            <Row>
                <Col xs={2}>
                    <Icon.PersonCheck size={18} />
                </Col>
                <Col xs={8}>
                    <Badge pill className={'text-white bg-primary'}>
                        Creator
                    </Badge>
                </Col>
            </Row>
            <Row>
                <Col xs={2}>
                    <Icon.House size={18} />
                </Col>
                <Col xs={8}>
                    <small>{props.notebook.organization.name}</small>
                </Col>
            </Row>
            <Row>
                <Col xs={2}>
                    <Icon.Cloud size={18} />
                </Col>
                <Col xs={8}>
                    <small>{props.notebook.environment.name}({props.notebook.environment.AwsAccountId})</small>
                </Col>
            </Row>
            <Row>
                <Col xs={2}>
                    <Icon.Globe2 size={18} />
                </Col>
                <Col xs={8}>
                    <small>{props.notebook.environment.region}</small>
                </Col>
            </Row>
            <Row>
                <Col xs={2}>
                    <Icon.ToggleOn size={18} />
                </Col>
                <Col xs={8}>
                    <small>{props.notebook.NotebookInstanceStatus}</small>
                </Col>
            </Row>
            <Row className={'mt-2'}>
                <If condition={props.notebook.NotebookInstanceStatus == 'InService'}>
                    <Then>
                        <Col xs={12}>
                            <Row>
                                <Col xs={4}>
                                    <If condition={url}>
                                        <Then>
                                            <a target={'_blank'} href={url}>open</a>
                                        </Then>
                                        <Else>
                                            <div onClick={getThisNotebookPresignedUrl} className={'btn btn-success rounded-pill btn-sm'}>
                                                Open
                                            </div>
                                        </Else>
                                    </If>

                                </Col>
                                <Col xs={4}>
                                    <div onClick={stopThisNotebook} className={'btn btn-info rounded-pill btn-sm'}>
                                        Stop
                                    </div>
                                </Col>
                            </Row>

                        </Col>

                    </Then>
                    <Else>
                        <Col xs={4}>
                            <div onClick={startThisNotebook} className={'btn btn-success rounded-pill btn-sm'}>
                                Start
                            </div>
                        </Col>

                    </Else>
                </If>

            </Row>

        </div>
    );
};
const Header = (props) => (
    <Row>
        <Col xs={8}>
            <Link to={`/notebook/${props.notebook.notebookUri}/overview`}>
                <b className={'text-capitalize'}>{props.notebook.label}</b>
            </Link>
        </Col>
    </Row>
);

const NotebookListItem = (props) => {
    const body = <Body {...props} />;
    const header = <Header {...props} />;
    return (
        <BasicCard
            label={props.notebook.label}
            owner={props.notebook.owner}
            created={props.notebook.created}
            description={props.notebook.description}
            body={body}
            header={header}
            tags={props.notebook.tags || []}
            topics={props.notebook.topics || []}
        />
    );
};


export default NotebookListItem;
