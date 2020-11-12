import React from "react";
import {Switch, Case, Default} from "react-if";
import {Row, Col,Badge,Spinner} from "react-bootstrap"


const StackStatusBadge = (props)=>{
    const status={
        progress:"P",
        failed:"F",
        complete:"C",
        warning:"W"
    }
    const statusMap= {
        'CREATE_IN_PROGRESS':status.progress,
        'CREATE_FAILED':status.failed,
        'CREATE_COMPLETE':status.complete,
        'ROLLBACK_IN_PROGRESS':status.progress,
        'ROLLBACK_FAILED':status.failed,
        'ROLLBACK_COMPLETE':status.warning,
        'DELETE_IN_PROGRESS':status.progress,
        'DELETE_FAILED':status.failed,
        'DELETE_COMPLETE':status.warning,
        'UPDATE_IN_PROGRESS': status.progress,
        'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS': status.progress,
        'UPDATE_COMPLETE': status.complete,
        'UPDATE_ROLLBACK_IN_PROGRESS' : status.progress,
        'UPDATE_ROLLBACK_FAILED': status.warning,
        'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS': status.progress,
        'UPDATE_ROLLBACK_COMPLETE' :status.warning,
        'REVIEW_IN_PROGRESS': status.progress,
        'IMPORT_IN_PROGRESS':status.progress,
        'IMPORT_COMPLETE':status.complete,
        'IMPORT_ROLLBACK_IN_PROGRESS': status.progress,
        'IMPORT_ROLLBACK_FAILED': status.failed,
        'IMPORT_ROLLBACK_COMPLETE': status.warning
    }

    const cat=statusMap[props.status];
    return <Switch>
        <Case condition={cat==status.complete}>
            <Badge pill variant={`success`}>
                {props.status}
            </Badge>
        </Case>
        <Case condition={cat==status.failed}>
            <Badge pill  variant={`danger`}>
                <p>{props.status}</p>
            </Badge>
        </Case>
        <Case condition={ cat==status.progress}>
            <Row>
                <Col xs={3}>
                    <Badge pill variant={`primary`}>
                        <p>{props.status}</p>
                    </Badge>
                </Col>
                <Col xs={1}>
                    <Spinner size={`sm`} animation={`border`} variant={`primary`}/>
                </Col>
            </Row>

        </Case>
        <Case condition={cat==status.warning}>
            <Badge pill variant={`warning`}>
                <p>{props.status}</p>
            </Badge>
        </Case>
        <Default>
            <Badge pill  variant={`warning`}>
                <p>{props.status}</p>
            </Badge>
        </Default>
    </Switch>
}


export default StackStatusBadge;
