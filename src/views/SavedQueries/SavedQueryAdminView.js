import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {
    If, Then, Else, Case, Switch, Default
} from 'react-if';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Loader from 'react-loaders';
import RoutedTabs from '../../components/Tabs/Tabs';
import useClient from '../../api/client';
import getScheduledQuery from '../../api/SavedQuery/getScheduledQuery';
import createSavedQuery from '../../api/SavedQuery/createSavedQuery';
import QueryOverviewTab from './QueryOverviewTab';
import QueryEditorTab from './QueryEditorTab';
import QuerySchedulerTab from './QuerySchedulerTab';
import QueryRunTab from './QueryRunTab';
import ItemViewHeader from '../../components/ItemViewHeader/ItemViewHeader';


const QueryAdmin = (props) => {
    const params = useParams();
    const client = useClient();
    const [query, setQuery] = useState({
        scheduledQuery: null,
        name: '',
        label: '',
        queries: {
            count: 0,
            page: 1,
            pages: 1,
            nodes: []
        }
    });

    const [ready, setReady] = useState(false);

    const createQuery = async () => {
        toast.info('Creating new query ! ');
        const response = await client.mutate(createSavedQuery({
            scheduledQueryUri: query.scheduledQueryUri,
            input: {
                label: 'new query',
                description: '',
                sqlBody: '-- example query \n select 1 as A'
            }
        }));

        await fetchQuery();
    };


    const fetchQuery = async () => {
        setReady(false);
        const response = await client.query(getScheduledQuery(params.uri));
        if (!response.errors) {
            setQuery({ ...response.data.getScheduledQuery });
        } else {
            toast(`Could not etrieve query, received ${response.errors[0].message}`);
        }
        setReady(true);
    };

    useEffect(() => {
        if (client) {
            fetchQuery();
        }
    }, [client]);

    const tabs = ['overview', 'queries', 'schedule', 'run'];

    if (!ready) {
        return (
            <Container>
                <Row>
                    <Col style={{ marginTop: '24%', marginLeft: '43%' }} xs={4}>
                        <Loader color={'lightblue'} type="ball-scale-multiple" />
                    </Col>
                </Row>
            </Container>
        );
    }
    return (
        <Container className={'mt-4'} fluid>
            <ItemViewHeader
                label={query.label}
                owner={query.owner}
                role={query.userRoleForScheduledQuery}
                region={query.environment.region}
                status={query.stack ? query.stack.status : 'Ready'}
                created={query.created}
                itemIcon={<Icon.Terminal size={32} />}
            />

            <Row className={'mt-4'}>
                <Col xs={12}>
                    <RoutedTabs tabs={tabs}></RoutedTabs>
                </Col>
            </Row>
            <Row>

                <Col xs={12}>
                    <Switch>
                        <Case condition={params.tab == 'queries'}>
                            <If condition={ready}>
                                <Then>
                                    <QueryEditorTab
                                        ready={ready}
                                        client={client}
                                        // saveQuery={saveQuery}
                                        createQuery={createQuery}
                                        query={query}
                                    />
                                </Then>
                            </If>
                        </Case>
                        <Case condition={params.tab == 'overview'}>
                            <If condition={ready}>
                                <Then>
                                    <QueryOverviewTab
                                        ready={ready}
                                        query={query}
                                    />
                                </Then>
                                <Else>

                                </Else>
                            </If>
                        </Case>
                        <Case condition={params.tab == 'schedule'}>
                            <QuerySchedulerTab query={query} />
                        </Case>
                        <Case condition={params.tab == 'run'}>
                            <If condition={ready}>
                                <Then>
                                    <QueryRunTab client={client} query={query} />
                                </Then>
                            </If>
                        </Case>
                        <Default>
                            {params.tab}
                        </Default>
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
};


export default QueryAdmin;
