import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const EnvironmentNotMemberListItem = (props) => {
    const { member } = props;
    const { environment } = props;
    const EnvironmentPermissions = [
        'Admin',
        'DatasetCreator',
        'Invited',
        'NotInvited'
    ].map((permissionLabel) => ({ label: permissionLabel, value: permissionLabel }));

    const options = [
        { label: member.userRoleInEnvironment, value: member.userRoleInEnvironment }
    ];
    let actionsDisabled = true;
    if (environment.userRoleInEnvironment == 'Admin' | environment.userRoleInEnvironment == 'Owner') {
        actionsDisabled = false;
        if (options[0].value != 'Admin') {
            options.push({
                label: 'Admin', value: 'Admin'
            });
        }
        if (options[0].value != 'Invited') {
            options.push({
                label: 'Invited', value: 'Invited'
            });
        }
    }
    if (member.userRoleInEnvironment == 'Owner') {
        actionsDisabled = true;
    }

    const [role, setRole] = useState(options[0]);
    const changeRole = (selectOption) => {
        setRole(selectOption);
    };

    const inviteUser = async () => {
        await props.inviteUser({
            userName: member.userName,
            role: role.value
        });
    };
    return (
        <tr>
            <td>
                {member.userName}
            </td>
            <td>
                {dayjs(member.created).fromNow()}
            </td>
            <td>
                {/** <Select onChange={changeRole} isDisabled={actionsDisabled} options={options} value={role}/>* */}
                <Select onChange={changeRole} isDisabled={actionsDisabled} options={EnvironmentPermissions} value={role} />
            </td>
            <td>
                {
                    (actionsDisabled) ? (
                        <p></p>
                    ) : (
                        <div onClick={inviteUser} className={'btn btn-sm border bg-white'}>Invite</div>
                    )
                }
            </td>
        </tr>
    );
};


export default EnvironmentNotMemberListItem;
