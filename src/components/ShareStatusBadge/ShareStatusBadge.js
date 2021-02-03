import React from "react";
import {Switch, Case, Default} from "react-if";
import {Badge} from "react-bootstrap"


const ShareStatusBadge = (props)=>{
    return <Switch>
        <Case condition={props.status==='Approved'}>
            <Badge pill variant={`success`}>
                {props.status}
            </Badge>
        </Case>
        <Case condition={props.status==='PendingApproval'}>
            <Badge pill variant={`warning`}>
                {props.status}
            </Badge>
        </Case>
        <Case condition={props.status==='Rejected'}>
            <Badge pill variant={`danger`}>
                {props.status}
            </Badge>
        </Case>
        <Case condition={props.status==='Draft'}>
            <Badge pill variant={`primary`}>
                {props.status}
            </Badge>
        </Case>
        <Default>
            <Badge pill  variant={`warning`}>
                <p>{props.status}</p>
            </Badge>
        </Default>
    </Switch>
}


export default ShareStatusBadge;
