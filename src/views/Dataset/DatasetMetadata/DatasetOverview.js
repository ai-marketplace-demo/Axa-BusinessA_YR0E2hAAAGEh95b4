import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Icon from 'react-bootstrap-icons';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import {
    If, Then, Else, When, Unless, Case, Default
} from 'react-if';
import EasyEdit, { Types } from 'react-easy-edit';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';

import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import styled from 'styled-components';
import useClient from '../../../api/client';
import getDataset from '../../../api/Dataset/getDataset';
import updateDataset from '../../../api/Dataset/updateDataset';
import Tag from '../../../components/Tag/Tag';
import UserProfileLink from '../../Profile/UserProfileLink';
import UserProfile from '../../Profile/UserProfile';


const Languages = [
    { label: 'German', value: 'German' },
    { label: 'English', value: 'English' },
    { label: 'French', value: 'French' },
];

const Classificiations = [
    { label: 'C1', value: 'C1' },
    { label: 'C2', value: 'C2' },
    { label: 'C3', value: 'C3' },
];


const Topics = Object.keys({
    Finances: 'Finances',
    HumanResources: 'HumanResources',
    Products: 'Products',
    Services: 'Services',
    Operations: 'Operations',
    Research: 'Research',
    Sales: 'Sales',
    Orders: 'Orders',
    Sites: 'Sites',
    Energy: 'Energy',
    Customers: 'Customers',
    Misc: 'Misc'
}).map((k) => ({ label: k, value: k }));

const _OverviewStyled = styled.div`
height: 25rem;
overflow-y: auto;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid #24a8c9;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`;

const OverviewStyled = styled.div`
height:100vh;
`;

const DatasetOverView = (props) => {
    const [regions, setRegions] = useState([

        { label: 'US East (Ohio)', value: 'us-east-2' },
        { label: 'US East (N. Virginia)', value: 'us-east-1' },
        { label: 'US West (N. California)', value: 'us-west-1' },
        { label: 'US West (Oregon)', value: 'us-west-2' },
        { label: 'Africa (Cape Town)', value: 'af-south-1' },
        { label: 'Asia Pacific (Hong Kong)', value: 'ap-east-1' },
        { label: 'Asia Pacific (Mumbai)', value: 'ap-south-1' },
        { label: 'Asia Pacific (Osaka-Local)', value: 'ap-northeast-3' },
        { label: 'Asia Pacific (Seoul)', value: 'ap-northeast-2' },
        { label: 'Asia Pacific (Singapore)', value: 'ap-southeast-1' },
        { label: 'Asia Pacific (Sydney)', value: 'ap-southeast-2' },
        { label: 'Asia Pacific (Tokyo)', value: 'ap-northeast-1' },
        { label: 'Canada (Central)', value: 'ca-central-1' },
        { label: 'China (Beijing)', value: 'cn-north-1' },
        { label: 'China (Ningxia)', value: 'cn-northwest-1' },
        { label: 'Europe (Frankfurt)', value: 'eu-central-1' },
        { label: 'Europe (Ireland)', value: 'eu-west-1' },
        { label: 'Europe (London)', value: 'eu-west-2' },
        { label: 'Europe (Milan)', value: 'eu-south-1' },
        { label: 'Europe (Paris)', value: 'eu-west-3' },
        { label: 'Europe (Stockholm)', value: 'eu-north-1' },
        { label: 'Middle East (Bahrain)', value: 'me-south-1' },
        { label: 'South America (São Paulo)', value: 'sa-east-1' },
        { label: 'AWS GovCloud (US-East)', value: 'us-gov-east-1' },
        { label: 'AWS GovCloud (US)', value: 'us-gov-west-1' },
    ]);
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


    const selectLanguage = (selectOption) => {
        setDetails({ ...details, language: selectOption });
        setHasChanged(true);
    };
    const selectClass = (selectOption) => {
        setDetails({ ...details, confidentiality: selectOption });
        setHasChanged(true);
    };

    const selectTopic = (selectoOption) => {
        setDetails({ ...details, topics: selectoOption });
        setHasChanged(true);
    };


    const selectStewardEmails = (selectOption) => {
        console.log('===<', selectOption);
        setDetails({ ...details, businessOwnerDelegationEmails: selectOption });
        setHasChanged(true);
    };


    const updateDetails = async () => {
        const response = await client.mutate(
            updateDataset({
                datasetUri: props.dataset.datasetUri,
                input: {
                    tags: details.tags,
                    description: details.description,
                    language: details.language.value,
                    businessOwnerDelegationEmails: details.businessOwnerDelegationEmails.map((s) => s.value),
                    businessOwnerEmail: details.businessOwnerEmail,
                    confidentiality: details.confidentiality.value,
                    topics: details.topics ? details.topics.map((t) => t.value) : []
                }
            })
        );
        if (!response.errors) {
            toast('Saved dataset changes');
        } else {
            toast(`Could not save dataset changes, received ${response.errors[0].message}`);
        }
    };
    const handleEdit = (field) => (value) => {
        setDetails({ ...details, [field]: value });
        setHasChanged(true);
    };


    const setTags = (tags) => {
        setDetails({ ...details, tags });
        setHasChanged(true);
    };

    const canEdit = ['Creator', 'Admin', 'BusinessOwner', 'DataSteward'].indexOf(props.dataset.userRoleForDataset) != -1;
    return (
        <Container className={'mt-4'}>

            <Row>
                <Col xs={3}>
                    <h6><b>Description</b></h6>
                </Col>
                <Col xs={9}>
                    <If condition={canEdit}>
                        <Then>
                            <EasyEdit
                                attributes={{ name: 'description' }}
                                type={Types.TEXT}
                                onSave={handleEdit('description')}
                                value={props.dataset.description}
                            >
                            </EasyEdit>

                        </Then>
                        <Else>
                            <p>{props.dataset.description}</p>
                        </Else>
                    </If>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <h6><b>Created By</b></h6>
                </Col>
                <Col xs={9}>
                    <UserProfileLink username={props.dataset.owner} />

                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <h6><b>Business Owner</b></h6>
                </Col>
                <Col xs={9}>
                    <If condition={canEdit}>
                        <Then>
                            <EasyEdit
                                attributes={{ name: 'businessOwnerEmail' }}
                                type={Types.TEXT}
                                onSave={handleEdit('businessOwnerEmail')}
                                value={props.dataset.businessOwnerEmail}
                            >
                            </EasyEdit>

                        </Then>
                        <Else>
                            <p>{props.dataset.description}</p>
                        </Else>
                    </If>
                </Col>
            </Row>

            <Row>
                <Col xs={3}>
                    <h6><b>Stewards</b></h6>
                </Col>
                <Col xs={9}>
                    <If condition={canEdit}>
                        <Then>
                            <Creatable
                                isMulti
                                onChange={selectStewardEmails}
                                // options={[]}
                                value={details.businessOwnerDelegationEmails}
                            />
                        </Then>
                        <Else>
                            {props.dataset.businessOwnerDelegationEmails && props.dataset.businessOwnerDelegationEmails.map((t) => <div>{t}</div>)}
                        </Else>
                    </If>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Organization</b>
                </Col>
                <Col xs={9}>
                    {props.dataset.organization.label}
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Environment</b>
                </Col>
                <Col xs={9}>
                    {props.dataset.environment.label}
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Region</b>
                </Col>
                <Col xs={9}>
                    {regions.find((r) => r.value == props.dataset.region).label} / ({props.dataset.region})
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <b>Language</b>
                </Col>
                <Col xs={9}>
                    <If condition={canEdit}>
                        <Then>
                            <Select options={Languages} value={details.language} onChange={selectLanguage} />
                        </Then>
                        <Else>
                            {props.dataset.language}
                        </Else>
                    </If>
                </Col>
            </Row>
            <Row className={'mt-1'}>
                <Col xs={3}>
                    <b>Classification</b>
                </Col>
                <Col xs={9}>
                    <If condition={canEdit}>
                        <Then>
                            <Select options={Classificiations} value={details.confidentiality} onChange={selectClass} />
                        </Then>
                        <Else>
                            {props.dataset.confidentiality}
                        </Else>
                    </If>
                </Col>
            </Row>
            <Row className={'mt-1'}>
                <Col xs={3}>
                    <b>Topics</b>
                </Col>
                <Col xs={9}>
                    <If condition={canEdit}>
                        <Then>
                            <Select isMulti onChange={selectTopic} value={details.topics} options={Topics} />
                        </Then>
                        <Else>
                            {props.dataset.topics.map((t) => <Tag tag={t} />)}
                        </Else>
                    </If>
                </Col>
            </Row>
            <Row className={'mt-1'}>
                <Col xs={3}>
                    <b>Tags</b>
                </Col>
                <Col xs={9}>
                    <If condition={canEdit}>
                        <Then>
                            <ReactTagInput
                                tags={details.tags}
                                onChange={setTags}
                            />
                        </Then>
                        <Else>
                            {
                                props.dataset.tags.map((t) => <Tag tag={t} />)
                            }


                        </Else>
                    </If>

                </Col>
            </Row>
            <If condition={canEdit}>
                <Then>
                    <If condition={hasChanged}>
                        <Then>
                            <Row className={'mt-3'}>
                                <Col xs={3} />
                                <Col xs={3}>
                                    <div onClick={updateDetails} className={'btn rounded-pill btn-info'}>Save</div>
                                </Col>

                            </Row>
                        </Then>

                    </If>

                </Then>
            </If>

        </Container>
    );
};


export default DatasetOverView;
