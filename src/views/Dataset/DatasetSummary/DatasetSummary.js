import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import {
    If, Then, Else, Switch, Case
} from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import { Link, useLocation, userParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import SimpleMDE from 'react-simplemde-editor';
import ReactMarkdown from 'react-markdown';
import useClient from '../../../api/client';
import getDatasetSummary from '../../../api/Dataset/getDatasetSummary';
import saveDatasetSummary from '../../../api/Dataset/saveDatasetSummary';
import 'easymde/dist/easymde.min.css';


const EditorStyled = styled.div`
height:100vh;
`;

const DatasetSummary = (props) => {
    const client = useClient();
    const [isEditorMode, setIsEditorMode] = useState(false);
    const [content, setContent] = useState('');
    const [ready, setReady] = useState(false);
    const canEdit = ['BusinessOwner', 'Admin', 'DataSteward', 'Creator'].indexOf(props.dataset.userRoleForDataset) != -1;

    const handleChange = (value) => {
        setContent(value);
    };
    const fetchSummary = async () => {
        setReady(false);
        const response = await client.query(getDatasetSummary(props.dataset.datasetUri));
        if (!response.errors) {
            setContent(response.data.getDatasetSummary);
        } else {
            toast(`Could not retrieve dataset summary, received ${response.errors[0].message}`);
            setContent(response.errors[0].message);
        }
        setReady(true);
    };

    const saveSummary = async () => {
        const response = await client.mutate(saveDatasetSummary({ datasetUri: props.dataset.datasetUri, content }));
        if (!response.errors) {
            toast('Saved summary');
        } else {
            toast(`Could not retrieve dataset summary, received ${response.errors[0].message}`);
        }
    };
    useEffect(() => {
        if (client) {
            fetchSummary();
        }
    }, [client]);

    if (!ready) {
        return (
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <Spinner variant={'info'} animation={'border'} size={'sm'} />
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <EditorStyled>
            <Container>
                <Row>

                    <Col xs={10} />
                    <Col xs={2}>
                        <If condition={isEditorMode}>
                            <Then>
                                <Row>
                                    <Col xs={6}>
                                        <div className={'btn-sm rounded-pill  btn btn-success'} onClick={saveSummary}>Save</div>
                                    </Col>
                                    <Col xs={6}>
                                        <div className={'btn-sm rounded-pill btn btn-secondary'} onClick={() => { setIsEditorMode(false); }}>Close</div>
                                    </Col>

                                </Row>

                            </Then>
                            <Else>
                                <If condition={canEdit}>
                                    <Then>
                                        <div className={'btn btn-sm btn-info rounded-pill'} onClick={() => { setIsEditorMode(true); }}><b>Edit</b></div>
                                    </Then>
                                </If>
                            </Else>
                        </If>
                    </Col>
                </Row>
                <Row className={'mt-4'}>
                    <Col xs={12}>
                        <If condition={isEditorMode}>
                            <Then>
                                <EditorStyled>
                                    <SimpleMDE
                                        value={content}
                                        onChange={handleChange}
                                    />
                                </EditorStyled>
                            </Then>
                            <Else>
                                <ReactMarkdown source={content} />
                            </Else>
                        </If>
                    </Col>
                </Row>

            </Container>
        </EditorStyled>
    );
};


export default DatasetSummary;
