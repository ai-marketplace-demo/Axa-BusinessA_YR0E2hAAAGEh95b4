import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import Select from 'react-select';
import * as Icon from 'react-bootstrap-icons';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useClient from '../../../api/client';
import MainButton from '../../../components/MainActionButton/MainButton';
import listProjectTrustRelationships from '../../../api/Project/listProjectTrustRelationships';
import removeProjectTrustRelationship from '../../../api/Project/removeProjectTrustRelationship';
import ProjectRelationshipListItem from './ProjectTrustRelationshipListItem';

dayjs.extend(relativeTime);


const Styled = styled.div`
height:100vh;
`;


const ProjectRelationshipList = (props) => {
    const client = useClient();

    const [trusts, setTrusts] = useState({
        count: 0,
        pageSize: 3,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });

    const [ready, setReady] = useState(false);

    const fetchItems = async () => {
        const response = await client
            .query(listProjectTrustRelationships({
                projectUri: props.project.projectUri,
                filter: {
                    page: trusts.page,
                    pageSize: 3
                }
            }));
        if (!response.errors) {
            setTrusts({ ...response.data.getProject.trustRelationships });
        } else {
            toast.warn(`Could not retrieve loader, received ${response.errors[0].message}`);
        }
        setReady(true);
    };
    const removeTrust = async ({ trustUri }) => {
        const res = await client.mutate(
            removeProjectTrustRelationship({ trustUri })
        );
        if (!res.errors) {
            toast(`Removed trust ${trustUri}`);
            if (trusts.page == 1) {
                fetchItems();
            } else {
                setTrusts({ ...trusts, page: 1 });
            }
        } else {
            toast.error(`Could not remove trust ${trustUri}, received ${res.errors[0].message}`);
        }
    };
    const nextPage = () => {
        if (trusts.hasNext) {
            setTrusts({ ...trusts, page: trusts.page + 1 });
        }
    };
    const prevPage = () => {
        if (trusts.hasPrevious) {
            setTrusts({ ...trusts, page: trusts.page - 11 });
        }
    };


    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, trusts.page]);


    return (
        <Styled>
            <Container>
                <Row className={''}>
                    <Col xs={8}>
                        <h4><Icon.Cloud size={24} />Trusted Relationships for <b className={'text-primary'}>{props.project.label}</b></h4>
                    </Col>
                    <Col xs={4}>
                        <MainButton>
                            <Link
                                to={`/project/${props.project.projectUri}/newtrust`}
                            >
                                Add Relationship
                            </Link>
                        </MainButton>
                    </Col>
                    <Col xs={4}>
                        <i>
                            Found {trusts.count} results
                        </i>
                    </Col>
                    <Col xs={4}>
                        <Row>
                            <Col className={'text-right'} xs={4}>
                                <Icon.ChevronLeft onClick={prevPage}>Previous</Icon.ChevronLeft>
                            </Col>
                            <Col className={'text-center'} xs={4}>
                                Page {trusts.page}/{trusts.pages}
                            </Col>
                            <Col xs={4}>
                                <Icon.ChevronRight onClick={nextPage}>Next</Icon.ChevronRight>
                            </Col>
                        </Row>

                    </Col>
                </Row>
                <Row className={'mt-4'}>
                    <Col xs={12}>
                        <table className={'table table-sm'}>
                            <thead>
                                <tr>
                                    <th>Iam Role</th>
                                    <th>Label</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    trusts.nodes && trusts.nodes.map((trust) => (
                                        <ProjectRelationshipListItem
                                            key={trust.trustUri}
                                            project={props.project}
                                            removeTrust={removeTrust}
                                            trust={trust}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        </Styled>
    );
};


export default ProjectRelationshipList;
