import React, {useState, useEffect} from "react";
import {Container, Table, Spinner, Row, Col, Tabs, Tab, Badge, Dropdown} from "react-bootstrap";
import {If, Then, Switch, Case, Default, Else} from "react-if";


const NextActionDecider = (props) => {
    let actions = null;
    if (props.share.userRoleForShareObject == "Approvers") {
        if (props.share.status == "PendingApproval") {
            actions = "PendingApproval"
        }
    }
    if (props.share.userRoleForShareObject == "Requesters") {
        if (props.share.status == "Draft") {
            actions = "Submit"
        }
    }

    return <Container fluid>
        <Row>

            <Switch>
                <Case condition={actions == "PendingApproval"}>
                    <Col xs={2}>
                        <div onClick={props.accept} className={`rounded-pill  btn-sm btn-success`}>
                            Approve
                        </div>
                    </Col>
                    <Col xs={2}>
                        <div onClick={props.reject} className={`rounded-pill btn btn-sm btn-danger`}>
                            Reject
                        </div>
                    </Col>
            </Case>
            <Case condition={actions==`Submit`}>
                <Col xs={2}>
                    <div onClick={props.submit} className={`rounded-pill btn btn-sm btn-info`}>
                        Submit
                    </div>
                </Col>
            </Case>
            <Default>
                <Col xs={3}>
                    <div onClick={props.submit} style={{border:'2px solid lightgrey'}} className={`rounded-pill btn btn-sm bg-white`}>
                        {props.share.status}
                    </div>
                </Col>
            </Default>
        </Switch>
        </Row>

    </Container>
}


export default NextActionDecider;
