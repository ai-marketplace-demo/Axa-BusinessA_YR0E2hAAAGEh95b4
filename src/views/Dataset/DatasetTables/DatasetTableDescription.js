import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import React, { useState } from 'react';
import { Else, If, Then } from 'react-if';
import SimpleMDE from 'react-simplemde-editor';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import updateDatasetTable from '../../../api/DatasetTable/updateDatasetTable';

const EditorStyled = styled.div`
height:100vh;
`;


const DatasetTableDescription = (props) => {
    const [isEditorMode, setIsEditorMode] = useState(false);
    const { client } = props;
    const [content, setContent] = useState(props.table.description || '');
    const [ready, setReady] = useState(false);
    const canEdit = ['BusinessOwner', 'Admin', 'DataSteward', 'Creator'].indexOf(props.dataset.userRoleForDataset) != -1;
    const handleChange = (value) => {
        setContent(value);
    };
    const saveTableDescription = async () => {
        const response = await client.mutate(updateDatasetTable({
            tableUri: props.table.tableUri,
            input: { description: content }
        }
        ));
        if (!response.errors) {
            toast('Update table description');
        } else {
            toast('Could not update table description');
        }
    };
    return (
        <Row>
            <Col xs={8} />
            <Col xs={4}>
                <If condition={isEditorMode}>
                    <Then>
                        <Row>
                            <Col xs={6}>
                                <div className={'btn-sm rounded-pill  btn btn-success'} onClick={saveTableDescription}>Save</div>
                            </Col>
                            <Col xs={6}>
                                <div className={'btn-sm rounded-pill btn btn-secondary'} onClick={() => { setIsEditorMode(false); }}>Close</div>
                            </Col>

                        </Row>

                    </Then>
                    <Else>
                        <If condition={canEdit}>
                            <Then>
                                <Row>
                                    <Col xs={6}>

                                        <div className={'btn btn-sm btn-info rounded-pill'} onClick={() => { setIsEditorMode(true); }}><b>Edit</b></div>
                                    </Col>
                                </Row>
                            </Then>
                        </If>
                    </Else>
                </If>
            </Col>
            <Col className={'mt-2'} xs={12}>
                <If condition={isEditorMode}>
                    <Then>
                        <EditorStyled>
                            <SimpleMDE
                                value={content}
                                onChange={handleChange}
                            />
                        </EditorStyled>
                    </Then>
                    <Else>
                        <ReactMarkdown source={content} />
                    </Else>
                </If>
            </Col>
        </Row>
    );
};


export default DatasetTableDescription;
