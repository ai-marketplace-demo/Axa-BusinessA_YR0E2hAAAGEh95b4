import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Spinner, Badge
} from 'react-bootstrap';
import { Switch, Case, Default } from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import useClient from '../../api/client';
import listEnvironments from '../../api/Environment/listEnvironments';
import getAuthorSession from '../../api/Dashboard/getDashboardAuthorSession';


const SessionLink = (props) => {
    const [sessionUrl, setSessionUrl] = useState();
    const [status, setStatus] = useState('idle');
    const client = useClient();
    const getUrl = async () => {
        setStatus('loading');
        const response = await client.query(getAuthorSession(props.environmentUri));
        if (!response.errors) {
            setSessionUrl(response.data.getAuthorSession);
            setStatus('ready');
        } else {
            setStatus('failed');
            toast.warn(`Could not retrieve session url , received ${response.errors[0].message}`);
        }
    };

    return (
        <Switch>
            <Case condition={status == 'idle'}>
                <Icon.Play onClick={getUrl} />
            </Case>
            <Case condition={status == 'loading'}>
                <Spinner size={'sm'} variant={'info'} animation={'border'} />
            </Case>
            <Case condition={status == 'ready'}>
                <a onClick={props.closeAll && props.closeAll} href={sessionUrl} target={'_blank'}>Open session</a>
            </Case>
            <Default>
                <div className={'warning'}>Failed</div>
            </Default>
        </Switch>
    );
};


const DashboardsEnvironmentList = (props) => {
    const client = useClient();
    const [envs, setEnvironments] = useState({
        count: 0,
        page: 1,
        pages: 0,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });
    const [ready, setReady] = useState(false);

    const fetchItems = async () => {
        const response = await client
            .query(listEnvironments({
                filter: {
                    // term :search,
                    page: envs.page,
                    roles: [],
                    pageSize: envs.pageSize
                }
            }));
        if (!response.errors) {
            setEnvironments(response.data.listEnvironments);
            setReady(true);
        } else {
            toast.error(`Failed to refresh environments, received ${response.errors[0].message}`);
        }
    };
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client]);


    if (!ready) {
        return <Spinner className={'mt-4'} variant={'info'} animation={'border'} size={'sm'} />;
    }

    return (
        <Container>
            <Row className={'mt-4'}>
                <Col xs={10} />
                <Col xs={2}>
                    <div onClick={() => { props.onClose(); }}>
                        <Icon.X /> close
                    </div>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={12}>
                    <table className={'table'}>
                        <thead>
                            <tr>
                                <th>Organization</th>
                                <th>Env Name</th>
                                <th>AWS AccountId</th>
                                <th>region</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                envs.nodes.map((env) => (
                                    <tr>
                                        <td>
                                            {env.organization.name}
                                        </td>
                                        <td>
                                            {env.name}
                                        </td>
                                        <td>
                                            {env.AwsAccountId}
                                        </td>
                                        <td>
                                            {env.region}
                                        </td>
                                        <td>
                                            <SessionLink closeAll={props.onClose} environmentUri={env.environmentUri} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Container>
    );
};


export default DashboardsEnvironmentList;
