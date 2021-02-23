import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import {
    If, Then, Else, Switch, Case
} from 'react-if';
import Editor, { ControlledEditor } from '@monaco-editor/react';
import EasyEdit, { Types } from 'react-easy-edit';
import useClient from '../../../api/client';
import addProjectPipelineNode from '../../../api/Project/addProjectPipelineNode';
import updateProjectPipelineNode from '../../../api/Project/updateProjectPipelineNode';

const ProjectPipelineScriptEditor = (props) => {
    const location = useLocation();
    const client = useClient();
    const { pipeline } = location.state;
    const [isEditorReady, setIsEditorReady] = useState(false);
    const valueGetter = useRef();

    const [file, setFile] = useState(location.state.file);
    const { parentFolder } = location.state;
    const [isNew, setIsNew] = useState(location.state.isNew);
    const [formData, setFormData] = useState({
        label: isNew ? 'untitled' : file.label,
        content: isNew ? '' : file.content,
        parentFolderUri: parentFolder ? parentFolder.nodeUri : ''
    });

    const handleEditorDidMount = (_valueGetter) => {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
    };


    const handleSaveLabel = (value) => {
        setFormData({ ...formData, label: value });
    };


    const submitForm = async () => {
        toast(`Saving ... ${isNew} ${formData.label} ${valueGetter.current()}`);
        let response = null;
        if (isNew) {
            response = await client.mutate(addProjectPipelineNode({
                pipelineUri: pipeline.pipelineUri,
                input: {
                    parentFolderUri: parentFolder && parentFolder.nodeUri || '',
                    label: formData.label,
                    nodeType: 'File',
                    content: valueGetter.current()
                }
            }));
            if (!response.errors) {
                toast('Saved new script');
                setFile(response.data.addProjectPipelineNode);
                setIsNew(false);
            } else {
                toast(`Could not save new script, retrieved ${response.errors[0].message}`);
            }
        } else {
            response = await client.mutate(updateProjectPipelineNode({
                nodeUri: file.nodeUri,
                input: {
                    // parentFolderUri : parentFolder&&parentFolder.nodeUri||"",
                    label: formData.label,
                    content: valueGetter.current()
                }
            }));
            if (!response.errors) {
                toast('Saved script');
                setIsNew(false);
                setFile(response.data.updateProjectPipelineNode);
            } else {
                toast(`Could not save new script, retrieved ${response.errors[0].message}`);
            }
        }
    };

    useEffect(() => {

    }, [client]);
    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Link
                        to={{
                            state: { pipeline },
                            pathname: `/project/${props.project.projectUri}/pipeline/${pipeline.pipelineUri}`
                        }}
                    >
                        <Icon.ChevronLeft color={'black'} size={24} />
                    </Link>

                </Col>
                <Col xs={11}>
                    <h4>
                        <EasyEdit
                            saveButtonStyle={'mb-2 btn bg-white border btn-sm'}
                            cancelButtonStyle={'mb-2 btn bg-white border btn-sm'}
                            type={Types.TEXT}
                            onSave={handleSaveLabel}
                            value={formData.label}
                        >
                        </EasyEdit>
                    </h4>


                </Col>
            </Row>
            <Row className={'mt-2'}>
                <Col xs={12}>
                    <Editor
                        editorDidMount={handleEditorDidMount}
                        value={formData.content}
                        theme={'vs-dark'}
                        inDiffEditor={false}
                        height="40vh"
                        language="sql"
                    />;
                </Col>
            </Row>
            <Row>
                <Col xs={8}>
                    <div className={'btn-group'}>
                        <div onClick={submitForm} className={'btn btn-sm btn-primary'}>Save</div>
                        <div className={'btn btn-sm  btn-success'}>Run</div>
                    </div>
                </Col>
            </Row>


        </Container>
    );
};

export default ProjectPipelineScriptEditor;
