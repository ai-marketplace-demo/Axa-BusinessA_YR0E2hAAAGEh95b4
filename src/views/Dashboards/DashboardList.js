import React, { useEffect, useState } from 'react';
import {
    Col, Row, Container, Spinner
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import * as MdIcon from 'react-icons/md';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainActionButton from '../../components/MainActionButton/MainButton';
import useClient from '../../api/client';
import searchDashboards from '../../api/Dashboard/searchDashboards';
import DashboardListItem from './DashboardListItem';
import DashboardsEnvironmentList from './EnvironmentList';
import Pager from '../../components/Pager/Pager';

const Styled = styled.div`
height:100vh;
background-color: transparent;
`;


const DashboardList = function () {
    const client = useClient();

    const [environmentsDisplayed, setEnvironmentsDisplayed] = useState(false);
    const [dashboards, setDashboards] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });
    const [ready, setReady] = useState(false);
    const displayEnvironments = () => {
        setEnvironmentsDisplayed(true);
    };

    const fetchItems = async () => {
        const response = await client.query(
            searchDashboards({})
        );
        if (!response.errors) {
            setDashboards(response.data.searchDashboards);
        } else {
            toast(`Could not retrieved dashboards, received ${response.errors[0].message}`);
        }
        setReady(true);
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client]);


    return (
        <Styled>
            <Container fluid className={'mt-4'}>

                <Row style={{ backgroundColor: 'transparent' }}>
                    <Col xs={6}>
                        <h3> <MdIcon.MdShowChart /> My Dashboards</h3>
                    </Col>
                    <Col xs={2} />
                    <Col xs={2} className={'mt-2'}>
                        <Link to={'/newdashboard'}>
                            <div className={'btn btn-info btn-sm rounded-pill'}> Import</div>
                        </Link>
                    </Col>

                    <Col xs={2} className={'mt-2'}>
                        <div onClick={displayEnvironments} className={'btn btn-primary btn-sm rounded-pill'}> Start Session </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Pager
                            label={'dashboard(s)'}
                            count={dashboards.count}
                            page={dashboards.page}
                            pages={dashboards.pages}
                            next={() => {}}
                            previous={() => {}}
                            onKeyDown={() => {}}
                            onChange={() => {}}
                        />
                    </Col>
                </Row>
                {/**
            <Row>
                <Col xs={6}>
                    <Row className={`mt-2`}>
                        <Col xs={4}><i>Found {dashboards.count} results</i></Col>
                        <Col className={`pt-1 text-right`} xs={2}><Icon.ChevronLeft onClick={()=>{}}/></Col>
                        <Col className={` text-center`} xs={4}>Page {dashboards.page}/{dashboards.pages}</Col>
                        <Col className={`pt-1 text-left`} xs={2}><Icon.ChevronRight onClick={()=>{}}/></Col>
                    </Row>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col xs={12}>
                    <input className={"form-control"} name={'search'} value={''} onKeyDown={()=>{}} onChange={()=>{}} placeholder={"search your dashboards"} style={{width:'100%'}}/>
                </Col>

            </Row>
             * */}
                <If condition={environmentsDisplayed}>
                    <Then>
                        <DashboardsEnvironmentList onClose={() => { setEnvironmentsDisplayed(false); }} />
                    </Then>
                </If>

                <Row className={'mt-3'}>
                    <If condition={!ready}>
                        <Then>
                            <Col xs={12}>
                                <Spinner variant={'info'} animation={'border'} size={'sm'} />
                            </Col>

                        </Then>
                        <Else>
                            <If condition={dashboards.count > 0}>
                                <Then>
                                    {
                                        dashboards.nodes.map((dashboard) => (
                                            <Col xs={4}>
                                                <DashboardListItem dashboard={dashboard} />
                                            </Col>
                                        ))
                                    }
                                </Then>
                                <Else>
                                    <div></div>
                                </Else>

                            </If>
                        </Else>
                    </If>


                </Row>
            </Container>
        </Styled>
    );
};


export default DashboardList;
