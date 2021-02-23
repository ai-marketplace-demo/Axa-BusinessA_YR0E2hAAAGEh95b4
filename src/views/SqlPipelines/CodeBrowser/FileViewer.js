import React, { useEffect, useState } from 'react';
import {
    Col, Row, Container, Form, Spinner, Tabs, Tab
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import { useParams, useHistory } from 'react-router';
import * as Icon from 'react-bootstrap-icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Editor from '@monaco-editor/react';
import listSqlPipelineBranches from '../../../api/SqlPipeline/listSqlPipelineBranches';
import browseSqlPipelineRepository from '../../../api/SqlPipeline/browseSqlPipelineRepository';
import useClient from '../../../api/client';

dayjs.extend(relativeTime);

const SqlPipelineFileViewer = (props) => (
    <Container>
        <Row>
            <Col xs={1}>
                <Icon.Arrow90degLeft onClick={() => { props.close && props.close(); }} />
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Editor
                    value={props.content}
                    options={{ minimap: { enabled: false } }}
                    // theme={"vs-dark"}
                    inDiffEditor={false}
                    height="19rem"
                    language={props.language}
                />
            </Col>
        </Row>
    </Container>
);


export default SqlPipelineFileViewer;
