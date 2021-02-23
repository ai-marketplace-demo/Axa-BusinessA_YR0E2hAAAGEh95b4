import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    If, Then, Else, When, Unless, Case, Default
} from 'react-if';
import { Badge, td, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import styled from 'styled-components';
import Select from 'react-select';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useClient from '../../../api/client';

dayjs.extend(relativeTime);

const OrganizationUserListItem = (props) => {
    const { user } = props;
    const { organization } = props;
    let options = {};
    let selectValue = {};
    let selectDisabled = false;
    let leaveDisabled = false;
    const canEdit = ['Owner', 'Admin'].indexOf(organization.userRoleInOrganization) != -1;
    const [role, setRole] = useState({ value: user.userRoleInOrganization, label: user.userRoleInOrganization });
    if (user.userRoleInOrganization == 'Owner') {
        options = [
            { value: 'Owner', label: 'Owner' }
        ];
        selectValue = options[0];
        leaveDisabled = true;
        selectDisabled = true;
    } else if (user.userRoleInOrganization == 'Admin') {
        if (organization.userRoleInOrganization == 'Admin') {
            options = [
                { value: 'Admin', label: 'Admin' },
            ];
        } else {
            options = [
                { value: 'Admin', label: 'Admin' },
                { value: 'Member', label: 'Member' },
            ];
        }

        selectValue = options[0];
    } else if (user.userRoleInOrganization == 'Member') {
        options = [
            { value: 'Member', label: 'Member' },
            { value: 'Admin', label: 'Admin' }
        ];
        selectValue = options[0];
    }
    if (organization.userRoleInOrganization == 'Member') {
        leaveDisabled = true;
        options = [{
            label: user.userRoleInOrganization, value: user.userRoleInOrganization
        }];
        selectValue = options[0];
        selectDisabled = true;
    }

    const leave = async () => {
        await props.leave({ userName: user.userName });
    };

    const handleRoleChange = async (selectOption) => {
        await props.updateRole({ userName: user.userName, selectRole: selectOption });
        setRole(selectOption);
        toast(
            `Updated ${user.userName} Role to ${selectOption.label}`,
            {
                autoClose: 2000,
                hideProgressBar: true
            });
    };


    return (
        <tr className={'mt-2'}>
            <td xs={3}>
                {user.userName}
            </td>
            <td xs={4}>
                <If condition={canEdit}>
                    <Then>
                        <Select onChange={handleRoleChange} isDisabled={selectDisabled} value={role} options={options} />
                    </Then>
                    <Else>
                        <p>{role.value}</p>
                    </Else>
                </If>
            </td>
            <td xs={3}><small>Invited {dayjs(user.created).fromNow()}</small></td>
            <td xs={2}>
                <If condition={canEdit}>
                    <Then>
                        <div className={'btn-group'}>
                            {
                                (leaveDisabled) ? (
                                    <div></div>
                                ) : (
                                    <div onClick={leave} className={'ml-1  border btn btn-sm'}> leave</div>
                                )
                            }
                        </div>
                    </Then>
                </If>
            </td>
        </tr>
    );
};

export default OrganizationUserListItem;
