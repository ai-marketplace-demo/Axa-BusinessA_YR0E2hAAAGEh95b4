import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Badge, Spinner
} from 'react-bootstrap';
import {
    If, Then, Else, Switch, Case, Default
} from 'react-if';
import { Auth, Hub } from 'aws-amplify';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Zoom from '../../components/Zoomer/Zoom';
import useClient from '../../api/client';
import listUserActivities from '../../api/Activity/listUserActivity';
import test from '../../api/Test/test';
import Pager from '../../components/Pager/Pager';

dayjs.extend(relativeTime);


const X = styled.div`
color: lightseagreen;

`;

const Home = () => {
    const client = useClient();
    const [logs, setLogs] = useState({
        ready: false,
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });
    const fetchItems = async () => {
        const response = await client.query(listUserActivities({ filter: { page: logs.page, pageSize: 5 } }));
        if (!response.errors) {
            setLogs({ ...response.data.listUserActivities, ready: true });
        } else {
            setLogs({ ...logs, ready: true });
            toast(`Could not retrieve recent activities, received ${response.errors[0].message}`);
        }
    };

    const nextPage = () => {
        if (logs.hasNext) {
            setLogs({ ...logs, page: logs.page + 1 });
        }
    };

    const previousPage = () => {
        if (logs.hasPrevious) {
            setLogs({ ...logs, page: logs.page - 1 });
        }
    };


    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, logs.ready, logs.page]);

    return (
        <Container fluid className={'mt-3'}>
            <Row>
                <Col xs={12}>
                    <h3> Recent Activities</h3>
                </Col>
            </Row>

            <Row>
                <If condition={logs.ready}>
                    <Then>
                        <Col xs={4}>
                            <p><i>Found {logs.count} recent activities</i></p>
                        </Col>
                        <Col xs={4}>
                            <Row>
                                <Col className={'mt-2 text-right'} xs={3}><Icon.ChevronLeft onClick={previousPage} /></Col>
                                <Col className={'text-center'} xs={6}> Page {logs.page}/{logs.pages}</Col>
                                <Col className={'mt-2 text-left'} xs={3}><Icon.ChevronRight onClick={nextPage} /></Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <input placeholder={'search resources or actions'} style={{ width: '100%' }} className={'rounded-pill form-control'} />
                        </Col>

                        <Col className={'mt-3'} xs={12}>
                            <table className={'table table-borderless table-sm '}>
                                <tr>
                                    <th>
                                        Resource
                                    </th>
                                    <th>
                                        Created
                                    </th>
                                    <th>
                                        Summary
                                    </th>
                                </tr>
                                <tbody>
                                    {
                                        logs.nodes.map((log) => (
                                            <tr className={'mt-1'}>
                                                <td>
                                                    <Switch>
                                                        <Case condition={log.targetType == 'org'}>
                                                            <Link to={'/organizations'}>
                                                                <Zoom color={'blue'}>
                                                                    <Icon.Gear className={'pt-1'} size={22} color={'blue'} />
                                                                </Zoom>
                                                            </Link>
                                                        </Case>
                                                        <Case condition={log.targetType == 'dataset'}>
                                                            <Link to={`/dataset/${log.targetUri}/overview`}>
                                                                <Zoom color={'lightcoral'}>
                                                                    <Icon.Folder className={'pt-1'} size={22} color={'lightcoral'} />
                                                                </Zoom>
                                                            </Link>
                                                        </Case>
                                                        <Case condition={log.targetType == 'project'}>
                                                            <Link to={`/project/${log.targetUri}/overview`}>
                                                                <Zoom color={'lightseagreen'}>
                                                                    <Icon.Play className={'pt-1'} color={'lightseagreen'} size={22} />
                                                                </Zoom>
                                                            </Link>
                                                        </Case>
                                                        <Case condition={log.targetType == 'env'}>
                                                            <Link to={`/environment/${log.targetUri}/permissions`}>
                                                                <Zoom color={'orange'}>
                                                                    <Icon.Cloud className={'pt-1'} color={'orange'} size={22} />
                                                                </Zoom>


                                                            </Link>
                                                        </Case>
                                                    </Switch>
                                                </td>
                                                <td>
                                                    {dayjs(log.created).fromNow()}
                                                </td>
                                                <td>
                                                    <p>{log.summary}</p>
                                                </td>

                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </Col>
                    </Then>
                    <Else>
                        <Spinner variant={'primary'} animation={'border'} />
                    </Else>
                </If>
            </Row>
        </Container>
    );
};


export default Home;
