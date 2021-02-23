import React from 'react';
import { Switch, Case, Default } from 'react-if';
import { Badge } from 'react-bootstrap';


const RoleBadge = (props) => (
    <Switch>
        <Case
            condition={
                props.role === 'Admin'
            || props.role === 'Creator'
            || props.role === 'Owner'
            }
        >
            <Badge pill variant={'primary'}>
                {props.role}
            </Badge>
        </Case>
        <Case condition={props.role === 'BusinessOwner'}>
            <Badge pill variant={'success'}>
                {props.role}
            </Badge>
        </Case>
        <Case condition={props.role === 'DataSteward'}>
            <Badge pill variant={'info'}>
                {props.role}
            </Badge>
        </Case>
        <Case condition={props.role === 'NotInvited' || props.role === 'NoPermission'}>
            <Badge pill variant={'danger'}>
                {props.role}
            </Badge>
        </Case>
        <Default>
            <Badge pill variant={'warning'}>
                <p>{props.role}</p>
            </Badge>
        </Default>
    </Switch>
);


export default RoleBadge;
