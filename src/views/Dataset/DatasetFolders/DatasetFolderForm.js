import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Table, Spinner, Badge
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import listDatasetStorageLocations from '../../../api/Dataset/listDatasetStorageLocations';
import DatasetFolderListITem from './DatasetFolderListItem';
import useClient from '../../../api/client';
import addDatasetStorageLocation from '../../../api/Dataset/addDatasetStorageLocation';


const DatasetFolderForm = (props) => {
    const client = useClient();

    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        prefix: '',
        label: '',
        description: '',
        tags: []
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const submitForm = async () => {
        setSaving(true);
        const input = formData;
        const res = await client.mutate(
            addDatasetStorageLocation({ datasetUri: props.dataset.datasetUri, input })
        );
        if (!res.errors) {
            setSaving(false);
            { props.close(); }
        } else {
            toast.error(`Could not create new location, received ${res.errors[0].message}`, { hideProgressBar: true });
            setSaving(false);
        }
    };


    return (
        <Container className={'border mt-1'} fluid>
            <Row className={'bg-secondary'}>
                <Col xs={12}>
                    New Folder Settings
                </Col>
            </Row>
            <Row className={'text-white mt-2'}>
                <Col xs={1}>
                    S3 path
                </Col>
                <Col xs={8}>
                    <b>{`s3://${props.dataset.S3BucketName}/${formData.prefix}`}</b>
                </Col>
                <Col xs={2}>
                    <If condition={saving}>
                        <Spinner variant={'primary'} animation={'border'} size={'sm'} />
                    </If>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={1}>
                    Prefix
                </Col>
                <Col xs={4}>
                    <input className={'rounded-pill form-control'} name={'prefix'} value={formData.prefix} onChange={handleInputChange} style={{ width: '100%' }} />
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={1}>
                    Name
                </Col>
                <Col xs={4}>
                    <input className={'rounded-pill form-control'} name={'label'} value={formData.label} onChange={handleInputChange} style={{ width: '100%' }} />
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={1}>
                    Description
                </Col>
                <Col xs={4}>
                    <input className={'rounded-pill form-control'} name={'description'} value={formData.description} onChange={handleInputChange} style={{ width: '100%' }} />
                </Col>
            </Row>

            <Row className={'mb-2 mt-3'}>
                <Col xs={1}>
                    <div onClick={props.close} className={'btn-sm  btn btn-secondary'}>
                        Cancel
                    </div>
                </Col>
                <Col xs={1}>
                    <div onClick={submitForm} className={'btn btn-sm btn-success'}>
                        Save
                    </div>
                </Col>
            </Row>
        </Container>
    );
};


export default DatasetFolderForm;
