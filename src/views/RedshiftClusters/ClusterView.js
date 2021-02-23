import React, { useState, useEffect } from 'react';
import {
    Row, Col, Container, Badge, Tabs, Tab, Spinner, DropdownButton, Dropdown
} from 'react-bootstrap';
import {
    useParams, useLocation, useHistory, Link, Switch, Route
} from 'react-router-dom';
import dayjs from 'dayjs';
import Loader from 'react-loaders';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Else, If, Then } from 'react-if';
import { toast } from 'react-toastify';
import * as FiIcon from 'react-icons/fi';
import styled from 'styled-components';
import {
    faPlayCircle, faPauseCircle,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { faAws } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Datashopper from './ClusterDatasets/Datashopper';
import RedshiftClusterDatasets from './ClusterDatasets/RedshiftClusterDatasets';
import ClusterDetails from './ClusterDetails';
import getCluster from '../../api/RedshiftCluster/getCluster';
import useClient from '../../api/client';
import resumeRedshiftCluster from '../../api/RedshiftCluster/resumeCluster';
import pauseRedshiftCluster from '../../api/RedshiftCluster/pauseCluster';
import deleteRedshiftCluster from '../../api/RedshiftCluster/deleteCluster';
import getClusterConsoleAccess from '../../api/RedshiftCluster/getClusterConsoleAccess';
import ClusterCredentials from './ClusterCredentials';
import ItemViewHeader from '../../components/ItemViewHeader/ItemViewHeader';

dayjs.extend(relativeTime);

const FullScreen = styled.div`
height:100vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}
`;

const RedshiftClusterView = (props) => {
    const client = useClient();
    const params = useParams();
    const history = useHistory();
    const [cluster, setCluster] = useState();
    const [ready, setReady] = useState(false);

    const [key, setKey] = useState('clusterDetails');

    useEffect(() => {
        if (client) {
            client
                .query(getCluster(params.uri))
                .then((response) => {
                    setCluster({ ...response.data.getRedshiftCluster });
                    if (history.location.pathname === `/redshiftcluster/${params.uri}/redshiftcreds`) {
                        setKey('clusterCreds');
                    } else if (history.location.pathname === `/redshiftcluster/${params.uri}/datasets`) {
                        setKey('datasets');
                    }
                    setReady(true);
                    console.log('cluster = ', cluster);
                }).catch((e) => {
                    toast(`Could not retrieve cluster details , received ${e.message}`);
                });
        }
    }, [client]);

    const getReshiftCluster = (clusterUri) => {
        client
            .query(getCluster(clusterUri))
            .then((response) => {
                setCluster({ ...response.data.getRedshiftCluster });
                setReady(true);
                console.log('cluster = ', cluster);
            }).catch((e) => {
                toast.error(`Could not retrieve cluster details , received ${e.message}`);
            });
    };

    const startCluster = async () => {
        toast(`Resuming cluster ${cluster.name}`);
        const response = await client.mutate(resumeRedshiftCluster(cluster.clusterUri));
        if (response.errors) {
            toast.error(`Could not Resume Cluster ${cluster.name}, ${response.errors[0].message}`, { hideProgressBar: true });
        } else {
            toast.success(`Cluster ${cluster.name} is resuming`);
            await getReshiftCluster(cluster.clusterUri);
        }
    };

    const stopCluster = async () => {
        toast(`Pausing cluster ${cluster.name}`);
        const response = await client.mutate(pauseRedshiftCluster(cluster.clusterUri));
        if (response.errors) {
            toast.error(`Could not Pause Cluster, ${response.errors[0].message}`, { hideProgressBar: true });
        } else {
            toast.success(`Cluster ${cluster.name} is pausing`);
            await getReshiftCluster(cluster.clusterUri);
        }
    };

    const deleteCluster = async () => {
        toast(`Deleting cluster ${cluster.name}`);
        const response = await client.mutate(deleteRedshiftCluster(cluster.clusterUri));
        if (response.errors) {
            toast.error(`Could not Delete cluster, ${response.errors[0].message}`, { hideProgressBar: true });
        } else {
            toast(`Deleting Cluster ${cluster.name}`);
            history.push('/redshiftclusters');
        }
    };

    const generateRedirectUrl = async () => {
        toast('Opening AWS console in new tab');
        client.query(
            getClusterConsoleAccess(cluster.clusterUri))
            .then((response) => {
                window.open(response.data.getRedshiftClusterConsoleAccess, '_blank');
            })
            .catch((e) => {
                toast(`Could not retrieve URL , received ${e.message}`);
            });
    };

    const handleActionButtons = async (key) => {
        if (key === 'consoleAccess') {
            await generateRedirectUrl();
        } else if (key === 'resume') {
            await startCluster();
        } else if (key === 'pause') {
            await stopCluster();
        } else if (key === 'delete') {
            await deleteCluster();
        }
    };

    const handleSelect = (key) => {
        if (key === 'datasets') {
            history.push(`/redshiftcluster/${cluster.clusterUri}/datasets`);
            setKey('datasets');
        } else if (key === 'clusterCreds') {
            history.push(`/redshiftcluster/${cluster.clusterUri}/redshiftcreds`);
            setKey('clusterCreds');
        } else {
            history.push(`/redshiftcluster/${cluster.clusterUri}`);
            setKey('clusterDetails');
        }
    };

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
        <FullScreen>
            <Container>
                <ItemViewHeader
                    label={cluster.label}
                    owner={cluster.owner}
                    status={cluster.CFNStackStatus}
                    role={cluster.userRoleForCluster}
                    region={cluster.region}
                    created={cluster.created}
                    itemIcon={<FiIcon.FiBox size={32} />}
                />
                <Row>
                    <Col className={'mt-4'} xs={12}>
                        <If condition={cluster.userRoleForCluster === 'Creator' || cluster.userRoleForCluster === 'Admin'}>
                            <Then>
                                <Row>
                                    <Col xs={12}>
                                        <DropdownButton id="dropdown-basic-button" className="float-right" variant={'outline-primary'} title="Actions">
                                            <Dropdown.Item eventKey="consoleAccess" onSelect={(k) => handleActionButtons(k)}>
                                                <FontAwesomeIcon icon={faAws} style={{ color: '#545b64', marginRight: '5px' }} size="sm" />
                                                Console
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="resume" onSelect={(k) => handleActionButtons(k)}>
                                                <FontAwesomeIcon icon={faPlayCircle} style={{ color: '#545b64', marginRight: '5px' }} size="sm" />
                                                Resume
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="pause" onSelect={(k) => handleActionButtons(k)}>
                                                <FontAwesomeIcon icon={faPauseCircle} style={{ color: '#545b64', marginRight: '5px' }} size="sm" />
                                                Pause
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="delete" onSelect={(k) => handleActionButtons(k)}>
                                                <FontAwesomeIcon icon={faTrashAlt} style={{ color: '#545b64', marginRight: '5px' }} size="sm" />
                                                Delete
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                </Row>
                                <Tabs
                                    activeKey={key}
                                    onSelect={(k) => handleSelect(k)}
                                >
                                    <Tab eventKey="clusterDetails" title="Cluster Details">
                                        <ClusterDetails cluster={cluster} />
                                    </Tab>
                                    <Tab eventKey="datasets" title="Link Datasets">
                                        <Switch>
                                            <Route path={'/redshiftcluster/:uri/datasets'}>
                                                <RedshiftClusterDatasets cluster={cluster} />
                                            </Route>
                                            <Route path={'/redshiftcluster/:uri/addDataset'}>
                                                <Datashopper cluster={cluster} />
                                            </Route>
                                        </Switch>
                                    </Tab>
                                    <Tab eventKey="clusterCreds" title="Cluster Credentials">
                                        <Switch>
                                            <Route path={'/redshiftcluster/:uri/redshiftcreds'}>
                                                <ClusterCredentials cluster={cluster} />
                                            </Route>
                                        </Switch>
                                    </Tab>
                                </Tabs>
                            </Then>
                            <Else>
                                <Tabs
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}
                                >
                                    <Tab eventKey="clusterDetails" title="Cluster Details">
                                        <ClusterDetails cluster={cluster} />
                                    </Tab>
                                </Tabs>
                            </Else>
                        </If>
                    </Col>
                </Row>
            </Container>
        </FullScreen>
    );
};
export default RedshiftClusterView;
