import React, { useState } from 'react';
import { If, Then, Else } from 'react-if';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FormSection from '../../../components/FormSection/FormSection';
import useClient from '../../../api/client';
import UserProfileLink from '../../Profile/UserProfileLink';
import General from './General';
import Ownership from './Ownership';

dayjs.extend(relativeTime);

const DatasetOverview = (props) => {
    const client = useClient();
    const params = useParams();
    const [hasChanged, setHasChanged] = useState(false);
    const [details, setDetails] = useState({
        label: props.dataset.label,
        businessOwnerEmail: props.dataset.businessOwnerEmail,
        businessOwnerDelegationEmails: props.dataset.businessOwnerDelegationEmails ? props.dataset.businessOwnerDelegationEmails.map((e) => ({ label: e, value: e })) : [],
        topics: props.dataset.topics ? props.dataset.topics.map((t) => ({ label: t, value: t })) : [],
        description: props.dataset.description,
        language: { label: props.dataset.language, value: props.dataset.language },
        confidentiality: { label: props.dataset.confidentiality, value: props.dataset.confidentiality },
        tags: props.dataset.tags
    });
    const canEdit = ['Creator', 'Admin', 'BusinessOwner', 'DataSteward'].indexOf(props.dataset.userRoleForDataset) != -1;

    const handleEdit = (field) => (value) => {
        setDetails({ ...details, [field]: value });
        setHasChanged(true);
    };


    const ownership = <Ownership {...props} canEdit={canEdit} handleEdit={handleEdit} />;
    const general = <General {...props} canEdit={canEdit} handleEdit={handleEdit} />;

    return (
        <Container fluid>
            <FormSection section={'general'} content={general} />
            <FormSection section={'ownership'} content={ownership} />
            <FormSection section={'metadata'} />
        </Container>
    );
};


export default DatasetOverview;
