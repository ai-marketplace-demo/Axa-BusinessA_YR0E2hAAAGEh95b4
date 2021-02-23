import React, { useState, useEffect } from 'react';
import {
    Row, Col, Container, Badge
} from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import {
    If, Then, Else, Switch, Case
} from 'react-if';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { toast } from 'react-toastify';
import Zoom from '../../../components/Zoomer/Zoom';
import useClient from '../../../api/client';
import getPipeline from '../../../api/Project/getPipeline';
import deleteProjectPipelineNode from '../../../api/Project/deletePipelineNode';
import updateProjectPipelineNode from '../../../api/Project/updateProjectPipelineNode';
import startPipeline from '../../../api/Project/startPipeline';
import listProjectPipelines from '../../../api/Project/listProjectPipelines';

dayjs.extend(relativeTime);

const PipelineView = (props) => {
    const location = useLocation();
    const client = useClient();
    const { pipeline } = location.state;

    const [currentFolder, setCurrentFolder] = useState({ label: '', nodeUri: null, nodeType: 'Folder' });
    const [previousFolder, setPreviousFolder] = useState({ label: '', nodeUri: null, nodeType: 'Folder' });
    const [folderHistory, setFolderHistory] = useState([]);
    const [nodes, setNodes] = useState({
        count: 1,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []

    }
    );

    const nextPage = () => {
        if (nodes.hasNext) {
            setNodes({ ...nodes, page: nodes.page + 1 });
        }
    };

    const prevPage = () => {
        if (nodes.hasPrevious) {
            setNodes({ ...nodes, page: nodes.page - 1 });
        }
    };

    const moveUp = async (file) => {
        const response = await client.mutate(updateProjectPipelineNode({
            nodeUri: file.nodeUri,
            input: {
                ordering: (file.ordering + 1)
            }
        }));
        if (!response.errors) {
            toast('Moved item up');
            await fetchItems();
        } else {
            toast(`Could not move up, ${response.errors[0].message}`);
        }
    };
    const moveDown = async (file) => {
        if (file.ordering > 1) {
            const response = await client.mutate(updateProjectPipelineNode({
                nodeUri: file.nodeUri,
                input: {
                    ordering: (file.ordering - 1)
                }
            }));
            if (!response.errors) {
                toast('Moved item up');
                await fetchItems();
            } else {
                toast(`Could not move up, ${response.errors[0].message}`);
            }
        }
    };

    const startPipelineExecution = async () => {
        const response = await client.mutate(startPipeline(pipeline.pipelineUri));
        if (!response.errors) {
            toast('Starting pipeline ');
        } else {
            toast(`Could not start pipeline, received ${response.errors[0].message}`);
        }
    };

    const deleteNode = async (file) => {
        const response = await client.mutate(deleteProjectPipelineNode(file.nodeUri));
        if (!response.errors) {
            setNodes({ ...nodes, page: 1 });
            await fetchItems();
        } else {
            toast(`Could not delete item, received ${response.errors[0].message}`);
        }
    };


    const fetchItems = async () => {
        const response = await client.query(getPipeline({
            pipelineUri: pipeline.pipelineUri,
            filter: {
                page: nodes.page,
                pageSize: 10,
                parentFolderUri: folderHistory.length ? (folderHistory[folderHistory.length - 1].nodeUri) : ''
            }
        }));
        if (!response.errors) {
            // toast(`Retrieved ${response.data.getPipeline.nodes.count} items`)
            setNodes({ ...response.data.getPipeline.nodes });
        } else {
            toast(`Could not retrieve pipelines, received ${response.errors[0].message}`);
        }
    };

    const push = (file) => {
        setFolderHistory(folderHistory.concat([file]));
    };

    const pop = () => {
        if (folderHistory.length) {
            folderHistory.pop();
            setFolderHistory(folderHistory.filter((t, i) => i < folderHistory.length));
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, nodes.page, folderHistory]);


    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Link
                        to={{
                            state: { pipeline },
                            pathname: `/project/${props.project.projectUri}/pipelines`
                        }
                        }
                    >
                        <Icon.ChevronLeft color={'black'} size={24} />
                    </Link>

                </Col>
                <Col xs={6}>
                    <h4><Icon.FileCode size={32} /> {pipeline.label}</h4>
                </Col>
                <Col xs={1}>
                    <Zoom color={'blue'}>
                        <Icon.Play onClick={startPipelineExecution} size={32} />
                    </Zoom>
                </Col>
                <Col xs={1}>
                    <Zoom>
                        <Link
                            to={{
                                state: {
                                    parentFolder: (folderHistory.length) ? folderHistory[folderHistory.length - 1] : null,
                                    pipeline
                                },
                                pathname: `/project/${props.project.projectUri}/pipeline/${pipeline.pipelineUri}/newfolder`
                            }}
                        >
                            <Icon.FolderPlus color={'black'} size={24} />
                        </Link>
                    </Zoom>

                </Col>
                <Col xs={1}>
                    <Zoom>
                        <Link
                            to={{
                                state: {
                                    parentFolder: (folderHistory.length) ? folderHistory[folderHistory.length - 1] : null,
                                    pipeline,
                                    isNew: true,
                                },
                                pathname: `/project/${props.project.projectUri}/pipeline/${pipeline.pipelineUri}/file/untitled`

                            }}
                        >
                            <Icon.FilePlus color={'black'} size={24} />
                        </Link>
                    </Zoom>
                </Col>
            </Row>
            <Row>

                <Col xs={2}>
                    <If condition={folderHistory.length >= 1}>
                        <Then>

                            <Icon.Arrow90degLeft size={22} onClick={pop} />
                            <b className={'text-primary'}>{folderHistory.length ? folderHistory.map((f) => f.label).join('/') : ''}</b>
                        </Then>
                    </If>
                </Col>

            </Row>
            <Row>
                <Col xs={4}>
                    <p>Found {nodes.count} nodes(s)</p>
                </Col>
                <Col xs={8}>
                    <Row>
                        <Col xs={3}><Icon.ChevronLeft /></Col>
                        <Col className={'mb-3'} xs={3}>Page {nodes.page}/{nodes.pages}</Col>
                        <Col xs={3}><Icon.ChevronRight /></Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <table className={'table '}>
                        <tr>
                            <th>
                                Order
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Last Update
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                        <If condition={nodes.count}>
                            <Then>
                                {
                                    nodes.nodes.map((file) => (
                                        <tr>
                                            <td>
                                                <Badge variant={'primary'} pill>{file.ordering}</Badge>
                                            </td>
                                            <td>
                                                <If condition={file.nodeType == 'Folder'}>
                                                    <Then>
                                                        <div onClick={() => { push(file); }}>
                                                            <Icon.Folder size={18} />  <b>{file.label}</b>{''} ({file.count} children)
                                                        </div>
                                                    </Then>
                                                    <Else>
                                                        <Link
                                                            style={{ color: 'black' }}
                                                            to={{
                                                                state: { pipeline, file },
                                                                pathname: `/project/${props.project.projectUri}/pipeline/${pipeline.pipelineUri}/file/${file.label}`
                                                            }}
                                                        >
                                                            <Icon.FileCode />  {file.name}
                                                        </Link>
                                                    </Else>
                                                </If>


                                            </td>
                                            <td>
                                                {dayjs(file.created).fromNow()}
                                            </td>
                                            <td>
                                                <div className={'btn-group'}>
                                                    <div onClick={() => { moveUp(file); }} className={'btn btn-sm bg-white border'}>Up</div>
                                                    <div onClick={() => { moveDown(file); }} className={'btn btn-sm bg-white border'}>Down</div>
                                                    <div onClick={() => { deleteNode(file); }} className={'btn btn-sm btn-warning'}>Delete</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </Then>
                            <Else>
                                <p><i>No File created</i></p>
                            </Else>
                        </If>
                    </table>
                </Col>
            </Row>

        </Container>
    );
};

export default PipelineView;
