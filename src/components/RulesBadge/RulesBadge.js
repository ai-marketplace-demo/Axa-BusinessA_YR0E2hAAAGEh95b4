import React from "react";
import {Switch, Case, Default} from "react-if";
import {Badge} from "react-bootstrap"


const RulesBadge = (props)=>{
    return <Switch>
        <Case condition={
            props.status==='InProgress'
            || props.status==='Running'
            || props.status==='Created'
            || props.status==='Updated'
        }>
            <Badge pill variant={`primary`}>
                {props.status}
            </Badge>
        </Case>
        <Case condition={props.status==='Succeeded' || props.status==='Compliant'}>
            <Badge pill variant={`success`}>
                compliant
            </Badge>
        </Case>
        <Case condition={props.status==='Failed' || props.status==='NonCompliant'}>
            <Badge pill variant={`danger`}>
                non-compliant
            </Badge>
        </Case>
        <Default>
            <Badge pill  variant={`warning`}>
                Unknown
            </Badge>
        </Default>
    </Switch>
}


export default RulesBadge;
