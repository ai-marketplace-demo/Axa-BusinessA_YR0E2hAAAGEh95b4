import React, { useEffect, useState } from 'react';
import {
    Col, Row, Container, Spinner, Tabs, Tab
} from 'react-bootstrap';
import {
    If, Then, Else, Switch, Case, Default
} from 'react-if';
import { useParams, useHistory } from 'react-router';
import * as MdIcon from 'react-icons/md';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Loader from 'react-loaders';
import useClient from '../../api/client';
import getDashboard from '../../api/Dashboard/getDashboard';
import QuicksightDesigner from './QuicksightDesigner';
import DashboardOverview from './DashboardOverview';
import DashboardShares from './DashboardShares';
import RoutedTabs from '../../components/Tabs/Tabs';
import getReaderSession from '../../api/Dashboard/getDashboardReaderSession';
import ItemViewHeader from '../../components/ItemViewHeader/ItemViewHeader';


const FullScreen = styled.div`
height: 120vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}\`

`;

const DashboardAdmin = (props) => {
    const client = useClient();
    const params = useParams();
    const [ready, setReady] = useState(false);
    const [key, setKey] = useState('Overview');
    const [dashboard, setDashboard] = useState({
        readerUrl: null
    });
    const [sessionUrl, setSessionUrl] = useState(null);

    const tabs = [
        'overview',
        'display',
        'share'
    ];

    const fetchReaderSessionUrl = async () => {
        if (!sessionUrl) {
            toast.info(`Retrieving session url for dashboard ${params.uri}`);
            const response = await client.query(getReaderSession(params.uri));
            toast.info('Got url');
            console.log('Received', response);
            if (!response.errors) {
                setSessionUrl(response.data.getReaderSession);
            } else {
                toast.error('Failed to retrieve session url');// , received ${response.errors[0].message}`);
            }
        }
    };

    const fetchDashboard = async () => {
        const response = await client.query(getDashboard(params.uri));
        if (!response.errors) {
            setDashboard(response.data.getDashboard);
        } else {
            toast.error(`Unexpected error${response.errors[0].message}`, { hideProgressBar: true });
        }
        setReady(true);
    };

    useEffect(() => {
        if (client) {
            fetchDashboard();
            fetchReaderSessionUrl();
        }
    }, [client]);


    if (!ready) {
        return (
            <Container>
                <Row>
                    <Col style={{ marginTop: '18%', marginLeft: '43%' }} xs={4}>
                        <Loader color={'lightblue'} type="ball-scale-multiple" />
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid className={'mt-3'}>
            <ItemViewHeader
                label={dashboard.label}
                owner={dashboard.owner}
                role={dashboard.userRoleForDashboard}
                region={dashboard.environment.region}
                created={dashboard.created}
                itemIcon={<MdIcon.MdShowChart size={32} />}
            />
            <Row className={'mt-3'}>
                <Col xs={12}>
                    <RoutedTabs tabs={tabs} />
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Switch>
                        <Case condition={params.tab == 'display'}>
                            <QuicksightDesigner
                                dashboard={dashboard}
                                sessionUrl={sessionUrl}
                            />
                        </Case>
                        <Case condition={params.tab == 'share'}>
                            <DashboardShares
                                dashboard={dashboard}
                            />
                        </Case>
                        <Default>
                            <DashboardOverview dashboard={dashboard} />
                        </Default>
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
};


export default DashboardAdmin;
