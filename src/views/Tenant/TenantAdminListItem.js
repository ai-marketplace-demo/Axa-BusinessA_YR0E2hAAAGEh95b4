import React from 'react';
import styled from 'styled-components';
import { If, Then, Else } from 'react-if';
import { Link, Switch, Route } from 'react-router-dom';
import {
    Container, Row, Col, Badge
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import useClient from '../../api/client';
import UserProfileLink from '../Profile/UserProfileLink';
import UserProfile from '../Profile/UserProfile';


const Circle = styled.div`
border-radius: 50%;
width:4ch;
height:4ch;
background-color: #61dafb;
text-align: center;

`;

const TenantAdminListItem = (props) => {
    const { tenantAdmin } = props;
    const removeTenantAdmin = () => {
        props.onRemove && props.onRemove(tenantAdmin.userName);
    };
    let canRemove = false;
    if (props.userRoleInTenant == 'Owner') {
        if (tenantAdmin.userRoleInTenant == 'Admin') {
            canRemove = true;
        }
    }

    return (
        <tr>
            <td>
                <Row>
                    <Col xs={1} />
                    <Col className={'text-capitalize'} xs={8}>
                        <UserProfileLink username={tenantAdmin.userName} />
                    </Col>
                </Row>
            </td>
            <td>
                <p>{tenantAdmin.userRoleInTenant}</p>
            </td>
            <td>
                <If condition={canRemove}>
                    <Then>
                        <div onClick={removeTenantAdmin} className={'btn btn-sm bg-white border'}>
                            Remove
                        </div>
                    </Then>
                </If>

            </td>
        </tr>
    );
};


export default TenantAdminListItem;
