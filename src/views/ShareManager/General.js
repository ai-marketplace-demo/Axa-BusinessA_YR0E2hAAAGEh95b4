import React,{useState,useEffect} from "react";
import {Container, Table,Spinner, Row, Col, Tabs,Tab,Badge,Dropdown} from "react-bootstrap";
import {If, Then, Switch, Case, Default,Else} from "react-if";
import {Link} from "react-router-dom";
import * as Icon from "react-bootstrap-icons"
import styled from "styled-components";

const TableStyled = styled.div`
    font-size: 0.9em;
    font-family: Helvetica;
    min-width: 400px;
    
`;

const General = (props)=>{

    return <Container className={`rounded border mt-1 pb-2`}fluid>
        <Row className={`p-3 border bg-secondary`}>
            <Col xs={12}>
                <b>General Access Request Settings</b>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <TableStyled>
                <Table size={`sm`} hover>
                    <thead>
                        <tr>
                            <th scope="col">Setting</th>
                            <th scope="col">Value</th>
                            <th scope="col">(Link)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <b>Role</b>
                            </td>
                            <td>
                                {props.share.userRoleForShareObject}
                            </td>
                            <td>
                                <div/>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <b>Owner</b>
                            </td>
                            <td>
                                {props.share.dataset.businessOwnerEmail}
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Status</b>
                            </td>
                            <td>
                                <Badge pill className={`border bg-white`}>
                                    {props.share.status}
                                </Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Dataset</b>
                            </td>
                            <td>
                                {props.share.dataset.datasetName}
                            </td>
                            <td>
                                <Link to={`/dataset/${props.share.dataset.datasetUri}`}>
                                    <Icon.Link/>
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Created</b>
                            </td>
                            <td>
                                {props.share.created}
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <b>Group</b>
                            </td>
                            <td>
                                {props.share.principal.SamlGroupName}
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <b>Aws Acccount</b>
                            </td>
                            <td>
                                {props.share.principal.AwsAccountId}
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <b>Region</b>
                            </td>
                            <td>
                                {props.share.principal.region}
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
                </TableStyled>
            </Col>
        </Row>
    </Container>
}


export default General;
