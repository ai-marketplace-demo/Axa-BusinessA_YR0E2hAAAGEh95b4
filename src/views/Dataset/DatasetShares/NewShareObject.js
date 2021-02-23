import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge, Dropdown
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import Avatar from 'react-avatar';
import Select from 'react-select';
import * as Icon from 'react-bootstrap-icons';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useClient from '../../../api/client';
import getDataset from '../../../api/Dataset/getDataset';
import addDatasetContributor from '../../../api/Dataset/addDatasetContributor';
import listOrganizations from '../../../api/Organization/listOrganizations';
import listOrganizationEnvironments from '../../../api/Environment/listOrganizationEnvironments';
import searchPrincipal from '../../../api/Principal/searchPrincipal';
import createShareObject from '../../../api/ShareObject/createShareObject';


dayjs.extend(relativeTime);


const SearchResult = styled.div`
width:100%;
&:hover{
background-color: whitesmoke;
}
`;

const DatasetShareObjectForm = (props) => {
    const client = useClient();
    const history = useHistory();
    const [term, setTerm] = useState('');
    const [orgs, setOrgs] = useState([]);
    const [envs, setEnvs] = useState([]);
    const [org, setOrg] = useState({});
    const [env, setEnv] = useState({});

    const fetchOrganizations = async () => {
        console.log('fetchOrganizations');
        const response = await client.query(listOrganizations({
            filter: { term: '', roles: ['Owner', 'Admin', 'Member'] }
        }));
        if (!response.errors) {
            console.log('fetchOrganizations ==>', response);
            setOrgs(response.data.listOrganizations.nodes.map((node) => ({ label: `${node.label} (${node.organizationUri})`, value: node.organizationUri })));
        } else {
            toast(`Could not retrieve organizations, received ${response.errors[0].message}`);
        }
    };

    const updateEnvs = async () => {
        console.log('updateEnvs', org);
    };


    const selectOrg = async (opt) => {
        console.log('selectOrg  ==', opt);
        setOrg(opt);
        const response = await client.query(listOrganizationEnvironments({
            organizationUri: opt.value
        }));
        if (!response.errors) {
            console.log('updateEnvs', response);
            setEnvs(response.data.getOrganization.environments.nodes.map((env) => ({ label: `${env.name}(#${env.AwsAccountId}/${env.SamlGroupName})`, value: env.environmentUri })));
        } else {
            toast(`Could not retrieve environments, received ${response.errors[0].message}`);
        }
    };

    const selectEnv = (opt) => {
        setEnv(opt);
    };

    const onSubmit = async () => {
        const res = await client.mutate(
            createShareObject({
                datasetUri: props.dataset.datasetUri,
                input: {
                    principalId: env.value,
                    principalType: 'Environment',
                    // label : env.label,
                }
            })
        );
        if (!res.errors) {
            toast(`Added share object  ${env.label} `, {
                hideProgressBar: true
            });
            props.close();
        } else {
            toast.error(`Could not add contributor, received ${res.errors[0].message}`, {
                hideProgressBar: true
            });
        }
    };


    useEffect(() => {
        if (client) {
            fetchOrganizations();
        }
    }, [client]);


    return (
        <Container className={'border'}>
            <Row className={'bg-secondary border-bottom'}>
                <Col xs={10}>
                    <b> Access Request Settings</b>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={12}>
                    <b>Organization</b>
                </Col>
                <Col xs={6}>
                    <Select
                        isMulti={false}
                        value={org}
                        isSearchable
                        options={orgs}
                        onChange={selectOrg}
                    />
                </Col>
            </Row>
            <Row className={'mt-3'}>
                <Col xs={12}>
                    <b>Environment</b>
                </Col>
                <Col xs={6}>
                    <Select
                        isMulti={false}
                        value={env}
                        isSearchable
                        options={envs}
                        onChange={selectEnv}
                    />
                </Col>
            </Row>
            <Row className={'mb-2 mt-2'}>
                <Col xs={2}>
                    <div onClick={props.close} className={'mt-2 rounded-pill btn-sm btn btn-secondary'}>
                        Cancel
                    </div>
                </Col>
                <Col xs={2}>
                    <If condition={org.label && env.label}>
                        <Then>
                            <div onClick={onSubmit} className={'mt-2 rounded-pill btn-sm btn btn-primary'}>
                                Create
                            </div>
                        </Then>
                    </If>
                </Col>

            </Row>
        </Container>
    );
};


export default DatasetShareObjectForm;
