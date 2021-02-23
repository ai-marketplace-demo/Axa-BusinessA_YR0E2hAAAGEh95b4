import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import {
    Link, useParams, useLocation, useHistory
} from 'react-router-dom';
import { toast } from 'react-toastify';
import MainButtonAction from '../../../components/MainActionButton/MainButton';
import useClient from '../../../api/client';
import listEnvironmentMembers from '../../../api/Environment/listEnvironmentMembers';
import removeUserFromEnvironment from '../../../api/Environment/removeMember';
import updateMemberRole from '../../../api/Environment/updateEnvironmentMemberRole';
import EnvironmentPermissionListItem from './EnvironmentPermissionListItem';


const EnvironmentPermissionList = (props) => {
    const options = [
        { value: 'admin', label: 'Admin' },
        { value: 'contributor', label: 'Contributor' },
        { value: 'viewew', label: 'Viewer' }
    ];
    const client = useClient();
    const params = useParams();
    const location = useLocation();
    const { environment } = location.state;
    const [ready, setReady] = useState(false);
    const [members, setMembers] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });

    const { environmentUri } = environment;
    const updateUserRoleInEnvironment = async ({ userName, role }) => {
        console.log('updateUserRoleInEnvironment', userName, role, environmentUri);
        const res = await client.mutate(updateMemberRole({ userName, role, environmentUri }));
        if (!res.errors) {
            toast(`Updated role of ${userName}`, { hideProgressBar: true });
        } else {
            toast.error(`Could not update role for ${userName}, received ${res.errors[0].message}`, { hideProgressBar: true });
        }
    };

    const leaveUser = async (userName) => {
        const res = await client.mutate(removeUserFromEnvironment({ userName, environmentUri }));
        if (!res.errors) {
            toast('Remived user');
        } else {
            toast.error(`Could not update role for ${userName}, received ${res.errors[0].message}`, { hideProgressBar: true });
        }
    };

    const fetchItems = async () => {
        const res = await client
            .query(listEnvironmentMembers(
                { environmentUri: environment.environmentUri }
            ));
        if (!res.errors) {
            setMembers(res.data.getEnvironment.users);
            setReady(true);
        } else {
            toast(`Could not retrieve users from envirponment, received ${res.errors[0].message}`);
        }
    };
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client]);

    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Row>
                        <Col className="text-left" xs={12}>
                            <Link
                                style={{ color: 'black' }}
                                to={{
                                    state: location.state.organization,
                                    pathname: `/organization/${location.state.organization.organizationUri}/environments`
                                }}
                            ><Icon.ChevronLeft size={36} />
                            </Link>
                        </Col>
                    </Row>
                </Col>
                <Col xs={9}>
                    <h3>  Permissions of environment <b className={'text-info'}>{location.state.environment.label}</b>(in Organization <b className={'text-primary'}>{location.state.organization.label}</b>) </h3>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={8}>
                    <input className={'form-control'} placeholder={'search members'} style={{ width: '100%' }} />
                </Col>
                <Col xs={2}>
                    <MainButtonAction>
                        <Link

                            to={{
                                state: location.state,
                                pathname: `/newenvironmentpermission/${params.uri}`
                            }}
                        >
                            <Icon.Plus size={18} /> Grant
                        </Link>
                    </MainButtonAction>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={11}>
                    {
                        (!ready) ? (
                            <Spinner variant="primary" animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>

                        ) : (
                            <table className={'table table-sm'}>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Added</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        members.nodes.map((member) => (
                                            <EnvironmentPermissionListItem
                                                key={member.userName}
                                                member={member}
                                                updateUserRoleInEnvironment={updateUserRoleInEnvironment}
                                                leaveUser={leaveUser}
                                                environment={environment}
                                            />
                                        ))
                                    }
                                </tbody>
                            </table>

                        )
                    }
                </Col>

            </Row>
        </Container>
    );
};


export default EnvironmentPermissionList;
