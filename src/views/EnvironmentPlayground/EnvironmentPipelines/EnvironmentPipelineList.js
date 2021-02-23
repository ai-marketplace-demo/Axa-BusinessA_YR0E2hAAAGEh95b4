import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import {
    If, Then, Else, Switch, Case
} from 'react-if';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainAction from '../../../components/MainActionButton/MainButton';
import useClient from '../../../api/client';
import listProjectPipelines from '../../../api/Project/listProjectPipelines';
import deletePipeline from '../../../api/Project/deletePipeline';

dayjs.extend(relativeTime);

const ProjectPipelineList = (props) => {
    const client = useClient();
    const [toggle, setToggle] = useState(false);
    const [pipelines, setPipelines] = useState({
        count: 1,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: [
            { pipelineUri: 'rtyup', label: 'my pipeline', created: new Date() }
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
        const response = await client.mutate(deletePipeline(pipeline.pipelineUri));
        if (!response.errors) {
            toast(`Deleted pipeline ${pipeline.pipelineUri}`);
            await fetchItems();
        } else {
            toast(`Could not delete pipeline, received ${response.errors[0].message}`);
        }
    };
    const fetchItems = async () => {
        const response = await client.query(listProjectPipelines(props.project.projectUri));
        if (!response.errors) {
            setPipelines({ ...response.data.listProjectPipelines });
        } else {
            toast(`Could not retrieve pipelines, received ${response.errors[0].message}`);
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, pipelines.page]);
    return (
        <Container>
            <Row>
                <Col xs={9}>
                    <h4><Icon.FileCode size={32} /> SQL Pipelines</h4>
                </Col>
                <Col xs={2}>
                    <Link
                        to={{
                            pathname: `/project/${props.project.projectUri}/newpipeline`
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
                                Description
                            </th>
                            <th>
                                Last Update
                            </th>

                            <th>
                                Executions
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
                                                        state: { pipeline },
                                                        pathname: `/project/${props.project.projectUri}/pipeline/${pipeline.pipelineUri}`
                                                    }}
                                                >
                                                    {pipeline.label}
                                                </Link>
                                            </td>
                                            <td>
                                                {pipeline.description}
                                            </td>
                                            <td>
                                                {dayjs(pipeline.created).fromNow()}
                                            </td>

                                            <td>
                                                <Link
                                                    to={{
                                                        state: { pipeline },
                                                        pathname: `/project/${props.project.projectUri}/pipeline/${pipeline.pipelineUri}/logs`
                                                    }}
                                                >
                                                    Logs
                                                </Link>
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
    );
};

export default ProjectPipelineList;
