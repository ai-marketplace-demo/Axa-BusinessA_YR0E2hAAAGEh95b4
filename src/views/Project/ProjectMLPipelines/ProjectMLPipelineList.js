import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
    If, Then, Else, Switch, Case
} from 'react-if';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainAction from '../../../components/MainActionButton/MainButton';
import useClient from '../../../api/client';
import listProjectMLPipelines from '../../../api/Project/listProjectMLPipelines';
import deleteProjectMLPipeline from '../../../api/Project/deleteMLPipeline';

dayjs.extend(relativeTime);


const Styled = styled.div`
height:100vh;
`;

const ProjectMLPipelineList = (props) => {
    const client = useClient();
    const [toggle, setToggle] = useState(false);
    const [pipelines, setPipelines] = useState({
        count: 1,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: [
        ]
    });


    const nextPage = () => {
        if (pipelines.hasNext) {
            setPipelines({ ...pipelines, page: pipelines.page + 1 });
        }
    };

    const prevPage = () => {
        if (pipelines.hasPrevious) {
            setPipelines({ ...pipelines, page: pipelines.page - 1 });
        }
    };

    const deleteProjectPipeline = async (pipeline) => {
        const response = await client.mutate(deleteProjectMLPipeline(pipeline.mlPipelineUri));
        if (!response.errors) {
            toast(`Deleted pipeline ${pipeline.label}`);
            await fetchItems();
        } else {
            toast(`Could not delete pipeline, received ${response.errors[0].message}`);
        }
    };
    const fetchItems = async () => {
        const response = await client.query(listProjectMLPipelines(props.project.projectUri));
        console.log('Pipelines---------->', response);
        if (!response.errors) {
            setPipelines({ ...response.data.listProjectMLPipelines });
        } else {
            toast(`Could not retrieve pipelines, received ${response.errors[0].message}`);
        }
    };

    useEffect(() => {
        if (client) {
            client.query(listProjectMLPipelines(props.project.projectUri));
            client
                .query(listProjectMLPipelines(
                    props.project.projectUri))
                .then((res) => {
                    console.log(res);
                    setPipelines(res.data.listProjectMLPipelines);
                })
                .catch((err) => {
                    console.log('!', err);
                });
        }
    }, [client, pipelines.page]);
    return (
        <Styled>
            <Container>
                <Row>
                    <Col xs={9}>
                        <h4><Icon.FileCode size={32} /> Machine Learning Pipelines</h4>
                    </Col>
                    <Col xs={2}>
                        <Link
                            to={{
                                pathname: `/project/${props.project.projectUri}/newmlpipeline`
                            }}
                        >
                            <MainAction>Create</MainAction>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <p>Found {pipelines.count} pipeline(s)</p>
                    </Col>
                    <Col xs={8}>
                        <Row>
                            <Col xs={3}><Icon.ChevronLeft /></Col>
                            <Col className={'mb-3'} xs={3}>Page {pipelines.page}/{pipelines.pages}</Col>
                            <Col xs={3}><Icon.ChevronRight /></Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <table className={'table table-sm'}>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Python Package
                                </th>
                                <th>
                                    Code Repository
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                            <If condition={pipelines.count}>
                                <Then>
                                    {
                                        pipelines.nodes.map((pipeline) => (
                                            <tr>
                                                <td>
                                                    <Link
                                                        to={{
                                                            pathname: `/project/${props.project.projectUri}/mlpipeline/${pipeline.mlPipelineUri}`
                                                        }}
                                                    >
                                                        {pipeline.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {pipeline.packageName}
                                                </td>
                                                <td>
                                                    <Link
                                                        to={{
                                                            state: { pipeline },
                                                            pathname: `${pipeline.codeRepositoryLink}`
                                                        }}
                                                    >
                                                        {pipeline.codeRepositoryLink}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {'Creating'}
                                                </td>
                                                <td>
                                                    <div onClick={() => { deleteProjectPipeline(pipeline); }} className={'btn btn-sm border bg-white'}>Delete</div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </Then>
                                <Else>
                                    <p><i>No Pipelines created</i></p>
                                </Else>
                            </If>
                        </table>
                    </Col>
                </Row>
            </Container>
        </Styled>
    );
};

export default ProjectMLPipelineList;
