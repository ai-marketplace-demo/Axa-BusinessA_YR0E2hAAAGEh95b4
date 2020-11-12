import React, {useState, useEffect} from "react";
import {Container, Table, Spinner, Row, Col, Tabs, Tab, Badge, Dropdown} from "react-bootstrap";
import {If, Then, Switch, Case, Default, Else} from "react-if";
import {Link} from "react-router-dom";
import * as Icon from "react-bootstrap-icons"
import styled from "styled-components";
import useClient from "../../api/client";
import getShareObject from "../../api/ShareObject/getShareObject";
import SharedItem from "./SharedItem";
import {toast} from "react-toastify";
import removeSharedItem from "../../api/ShareObject/removeSharedItem";


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
                        <div onClick={props.accept} className={`rounded-pill btn btn-sm btn-primary`}>
                            Approve
                        </div>
                    </Col>
                    <Col xs={2}>
                        <div onClick={props.reject} className={`rounded-pill btn btn-sm btn-secondary`}>
                            Reject
                        </div>
                    </Col>
            </Case>
            <Case condition={actions==`Submit`}>
                <Col xs={2}>
                    <div onClick={props.submit} className={`rounded-pill btn btn-sm btn-primary`}>
                        Submit
                    </div>
                </Col>
            </Case>
            <Default>
                <Col xs={1}>{props.share.status}</Col>
            </Default>
        </Switch>
        </Row>

    </Container>
}


export default NextActionDecider;
