import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Table, Row, Col, ListGroupItem, ListGroup
} from 'react-bootstrap';

import * as Icon from 'react-bootstrap-icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ProjectListItem from './ProjectListItem';
import MainActionButton from '../../components/MainActionButton/MainButton';
import Tile from '../../components/Tile/Tile';
import useClient from '../../api/client';
import listProjects from '../../api/Project/listProjects';


const ProjectList = (props) => {
    const client = useClient();
    const [ready, setReady] = useState(false);

    const [projects, setProjects] = useState({
        count: 0,
        page: 1,
        pageSize: 5,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });


    const fetchItems = async () => {
        const response = await client.query(listProjects({
            roles: ['ProjectCreator', 'Admin']
        }));
        if (!response.errors) {
            setReady(true);
            setProjects(response.data.listProjects);
        } else {
            toast.error(`Could not retrieve projects, received ${response.errors[0].message}`);
        }
    };
    const nextPage = () => {
        if (projects.hasNext) {
            setProjects({ ...projects, page: projects.page + 1 });
        }
    };
    const previouPage = () => {
        if (projects.hasPrevious) {
            setProjects({ ...projects, page: projects.page - 11 });
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client]);

    return (
        <React.Fragment>
            <Container className={''}>
                <Row>
                    <Col xs={3}>
                        <h3> <Icon.FileCode /> My Projects </h3>
                    </Col>
                    <Col xs={7}>
                        <Row className={'mt-2'}>
                            <Col xs={4}><i>Found {projects.count} results</i></Col>
                            <Col xs={2}><Icon.ChevronLeft onClick={previouPage} /></Col>
                            <Col xs={4}>Page {projects.page}/{projects.pages}</Col>
                            <Col xs={2}><Icon.ChevronRight onClick={nextPage} /></Col>
                        </Row>
                    </Col>
                    <Col xs={2} className={'text-right mt-2'}>
                        <MainActionButton>
                            <Link to={'/newproject'}>
                                Create
                            </Link>
                        </MainActionButton>
                    </Col>
                </Row>
                <Row className={'mt-3'}>
                    <Col xs={12}>
                        <input className={'form-control'} placeholder={'search your projects'} style={{ width: '100%' }} />
                    </Col>
                </Row>
                <Row>
                    <Col className={'ml-1 mt-1'} xs={4}>
                        {
                            ready ? (
                                <div />

                            ) : (
                                <Spinner variant="primary" animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>

                            )}

                    </Col>
                </Row>
                <Row className={'mt-4'}>
                    {
                        !projects.count ? (
                            <Col>
                                <p><i>No Projects Found.</i></p>
                            </Col>
                        ) : (
                            <Col>
                                <Row>
                                    {
                                        projects.nodes.map((project) => (
                                            <Col className={'mt-1'} key={project.uri} xs={4}>
                                                <ProjectListItem project={project} />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </Col>
                        )
                    }
                </Row>

            </Container>
        </React.Fragment>
    );
};


export default ProjectList;
