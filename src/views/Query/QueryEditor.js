import React, { useState } from 'react';
import {
    Row, Col, Container, Button
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    useParams,
    useRouteMatch,
    useHistory
} from 'react-router-dom';
import FullScreen from '../../components/FullScreen/Fullscreen';


const QueryEditor = (props) => {
    const history = useHistory();
    const { path, url } = useRouteMatch();
    const versions = [{
        value: 'current', label: 'current'
    }];
    return (
        <FullScreen>
            <Container className={'m-0 p-0'}>
                <Row className={'border-bottom'}>
                    <Col xs={1}>
                        <Row>
                            <Col className={'tex-center'}>
                                <Link to={'/dataset/mydataset'}> <Icon.ChevronLeft color={'black'} className="pt-3 pr-3" size={40} /></Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={'tex-center'}>
                                <small>back</small>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={4}>
                        <Row>
                            <Col className="pt-3" xs={2}>
                                <Icon.FileCode size={32} />
                            </Col>
                            <Col xs={10}>
                                <Row>
                                    <h4>My Query</h4>
                                </Row>
                                <Row>
                                    <p>by <a href={'#'}>@moshirm</a></p>
                                </Row>

                            </Col>
                        </Row>
                    </Col>
                    <Col xs={4} />
                    <Col className="pt-3" xs={2}>
                        <Row>
                            <Col><Button className={'rounded-0'} size={''} variant={'success'}> Run</Button></Col>
                            <Col><Button className={'rounded-0'} size={''} variant={'primary'}> Save</Button></Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={'pt-4'}>
                    <Col xs={11}>
                        <Editor value={'select * from mytable'} options={{ minimap: { enabled: false } }} theme={'vs-dark'} inDiffEditor={false} height="19rem" language="sql" />
                    </Col>
                </Row>
            </Container>
        </FullScreen>
    );
};


export default QueryEditor;
