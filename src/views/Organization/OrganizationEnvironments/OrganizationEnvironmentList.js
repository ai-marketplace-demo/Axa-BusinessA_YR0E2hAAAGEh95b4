import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import { Link, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainButtonAction from '../../../components/MainActionButton/MainButton';
import OrganizationEnvironmentListItem from './OrganizationEnvironmentListItem';
import useClient from '../../../api/client';
import listOrganizationEnvironments from '../../../api/Environment/listOrganizationEnvironments';
import archiveEnvironment from '../../../api/Environment/archiveEnvironment';
import listOrganizations from '../../../api/Organization/listOrganizations';
import Pager from '../../../components/Pager/Pager';


dayjs.extend(relativeTime);

const Styled = styled.div`
height: 100vh;

`;


const OrganizationEnvironmentList = (props) => {
    const params = useParams();
    const location = useLocation();
    const client = useClient();
    const [ready, setReady] = useState(false);
    const [envs, setEnvironments] = useState({
        count: 0,
        nodes: [],
        page: 1,
        hasNext: false,
        hasPrevious: false,
        pageSize: 3,
        pages: 0
    });
    const [search, setSearch] = useState('');
    const [sortCriterias, setSortCriterias] = useState({ label: 'asc', created: 'desc' });
    const organization = location.state;
    let canLink = false;
    if (organization.userRoleInOrganization == 'Admin' | organization.userRoleInOrganization == 'Owner') {
        canLink = true;
    }

    const [displayArchiveModal, setDisplayArchiveModal] = useState(false);
    const [targetEnv, setTargetEnv] = useState(false);


    const onDisplayArchiveModal = (env) => {
        setTargetEnv(env);
        setDisplayArchiveModal(true);
    };

    const archiveEnv = async () => {
        const response = await client.mutate(archiveEnvironment(targetEnv.environmentUri));
        if (!response.errors) {
            toast(`Successfully archived environment ${targetEnv.name}(${targetEnv.environmentUri})`);
            fetchItems();
        } else {
            toast(`Could not archive environment ${targetEnv.environmentUri}. Received ${response.errors[0].message}`);
        }
        setTargetEnv(null);
        setDisplayArchiveModal(false);
    };


    const fetchItems = async () => {
        console.log('fetchItems search = ', search);
        const response = await client
            .query(listOrganizationEnvironments({
                organizationUri: organization.organizationUri,
                filter: {
                    term: search,
                    page: envs.page,
                    pageSize: envs.pageSize,
                    displayArchived: false,
                    roles: [
                        'Owner',
                        'Admin',
                        'Invited',
                        'DatasetCreator'
                    ],
                    sort: Object.keys(sortCriterias).map((k) => ({ field: k, direction: sortCriterias[k] }))
                }
            }));
        console.log('response = ', response);
        if (!response.errors) {
            setEnvironments(response.data.getOrganization.environments);
            setReady(true);
        } else {
            toast.error(`Failed to refresh environments, received ${response.errors[0].message}`);
        }
    };

    const handleInputChange = async (event) => {
        setSearch(event.target.value);
    };

    const handleChangeSort = async (field) => {
        setSortCriterias({ ...sortCriterias, [field]: sortCriterias[field] == 'asc' ? 'desc' : 'asc' });
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            await fetchItems();
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, envs.page]);

    const nextPage = () => {
        if (envs.hasNext) {
            setEnvironments({ ...envs, page: envs.page + 1 });
        }
    };

    const prevPage = () => {
        if (envs.hasPrevious) {
            setEnvironments({ ...envs, page: envs.page - 1 });
        }
    };
    return (
        <Container fluid className={'mt-4'}>
            <Row>
                <Col xs={10}>
                    <h3>   <Icon.Cloud size={32} /> Environments in Organization <b className={'text-info'}><Link to={'/organizations'}>{location.state.label.toUpperCase()}</Link></b></h3>
                </Col>
                <Col xs={2}>
                    <Link
                        to={{
                            state: location.state,
                            pathname: `/newenvironment/${params.uri}`
                        }}
                    >
                        <div className={'rounded-pill btn-sm btn btn-info'}>
                            Link
                        </div>
                    </Link>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={12}>
                    <Pager
                        label={'environment(s)'}
                        page={envs.page}
                        pages={envs.pages}
                        next={nextPage}
                        count={envs.count}
                        previous={prevPage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                </Col>
                {/**

            <Col xs={3}><i>Found <b>{envs.count}</b> results</i></Col>
            <Col xs={4}>
                <Row>
                    <Col className={`text-right pt-2`}><Icon.ChevronLeft onClick={prevPage}/></Col>
                    <Col className={`text-center`}>Page {envs.page}/{envs.pages}</Col>
                    <Col className={`text-left pt-2`}><Icon.ChevronRight onClick={nextPage}/></Col>
                </Row>
            </Col>
            <Col xs={3}/>
            <Col className={`mb-1 pr-2 text-right`} xs={2}>
                {
                    (canLink)?(
                            <MainButtonAction>
                            <Link

                                to={{
                                    state: location.state,
                                    pathname:`/newenvironment/${params.uri}`
                                }}>Link</Link>
                            </MainButtonAction>
                    ):(
                        <div></div>
                    )
                }
            </Col>
            <Col xs={12}>
                <input className={`form-control`} onKeyDown={handleKeyDown} onChange={handleInputChange} value={search} placeholder={'search environments'} style={{width:"100%"}}/>
            </Col>
             * */}
            </Row>
            <Row className={'mt-3'}>
                <Col className={''} xs={12}>
                    <If condition={displayArchiveModal}>
                        <Then>
                            <div className={'border mt-2 mb-2 alert alert-secondary'}>
                                <Row className={''}>
                                    <Col xs={8}>
                                        Archive Environment <b>{targetEnv && targetEnv.name}({targetEnv && targetEnv.environmentUri})</b>
                                    </Col>
                                    <Col xs={4}>
                                        <div className={'btn-group'}>
                                            <div onClick={archiveEnv} className={'btn btn-sm btn-warning'}>Archive</div>
                                            <div className={'pl-2 btn btn-sm  btn-primary'} onClick={() => { setDisplayArchiveModal(false); setTargetEnv(null); }}>Cancel</div>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        Archiving will archive all child resources associated with the environment
                                    </Col>
                                </Row>
                            </div>
                        </Then>
                    </If>
                </Col>
            </Row>

            <Row className={'mt-2'}>
                <If condition={!ready}>
                    <Then>
                        <Col xs={12}>
                            <Spinner variant="primary" animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Then>
                    <Else>
                        <If condition={envs.nodes.length}>
                            <Then>
                                {
                                    envs.nodes.map((env) => (
                                        <Col xs={4}>
                                            <OrganizationEnvironmentListItem
                                                onDisplayArchiveModal={onDisplayArchiveModal}
                                                key={env.environmentUri}
                                                environment={env}
                                                organization={location.state}
                                            />
                                        </Col>
                                    ))
                                }

                            </Then>
                            <Else>
                                <Col xs={12}>
                                    <p><i>No Environments found (or accessible to you) in this organization</i></p>
                                </Col>
                            </Else>
                        </If>

                    </Else>
                </If>
            </Row>
        </Container>
    );
};


export default OrganizationEnvironmentList;
