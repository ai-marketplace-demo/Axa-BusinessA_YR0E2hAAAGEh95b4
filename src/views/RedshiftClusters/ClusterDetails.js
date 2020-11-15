import React, {useState, useEffect, Component} from "react";
import {Container, Spinner, Row, Col, Badge, Card, DropdownButton, Dropdown, Table} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import styled from "styled-components"
import useClient from "../../api/client";
import SpanZoomer from "../../components/Zoomer/SpanZoomer";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime";
import {Link} from "react-router-dom";
import LinkSpan from "../../components/Link/LinkSpan";
import * as PropTypes from "prop-types";
import FormSection from "../../components/FormSection/FormSection";
import DatasetAccount from "../Dataset2/DatasetDetails/Account";
dayjs.extend(relativeTime);


const DetailStyled=styled.div`
height:100vh;
`;

const InfoSpan=styled.span`
color: #545b64;
font-weight: bold;
`;
const TruncatedSpan=styled.span`
white-space:nowrap;
 overflow:hidden;
 text-overflow:ellipsis;
`;


class ClusterDetailsNetworking extends Component {
    render() {
        return <Row className={`mt-2`}>
                <Col xs={12}>
                    <Table  hover size="sm">
                        <tbody>
                        <tr class="d-flex">
                            <td class="col-3">
                                VPC
                            </td>
                            <td class="col-9">
                                <b>{this.props.cluster.vpc}</b>
                            </td>
                        </tr>
                        <tr class="d-flex">
                            <td className={`text-capitalize col-3`}>
                                Subnet Group
                            </td>
                            <td class="col-9">
                                {this.props.cluster.subnetGroupName || "-"}
                            </td>
                        </tr>
                        <tr class="d-flex">
                            <td className={`text-capitalize col-3`}>
                                Security Groups
                            </td>
                            <td class="col-9">
                                {this.props.cluster.securityGroupIds ? this.props.cluster.securityGroupIds[0] : "-"}
                            </td>
                        </tr>
                        <tr class="d-flex">
                            <td className={`text-capitalize col-3`}>
                                KMS Alias
                            </td>
                            <td class="col-9">
                                {this.props.cluster.KMSAlias || "-"}
                            </td>
                        </tr>
                        <tr class="d-flex">
                            <td className={`text-capitalize col-3`}>
                                IAM Roles
                            </td>
                            <td class="col-9">
                                {this.props.cluster.IAMRoles ? this.props.cluster.IAMRoles[0] : "-"}
                            </td>
                        </tr>
                        </tbody>

                    </Table>
                </Col>
            </Row>;
    }
}

ClusterDetailsNetworking.propTypes = {cluster: PropTypes.any};

class ClusterDetailsGeneralInfo extends Component {
    render() {
        return <Row className={`mt-2`}>
            <Col xs={12}>
                <Table   hover size="sm">
                    <tbody>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Status
                        </td>
                        <td class="col-9">
                            <Badge className={'mt-2'} variant={`${this.props.primary} text-uppercase`}
                                   pill>{this.props.cluster.status}</Badge>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`col-3`}>
                            Identifier
                        </td>
                        <td className={`col-9`}>
                            <b>{this.props.cluster.name}</b>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Region
                        </td>
                        <td className={`col-9`}>
                            {this.props.cluster.region || "-"}
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Environment
                        </td>
                        <td className="col-9">
                            <Link to={`/playground/${this.props.cluster.environment.environmentUri}`}>
                                <b className={`text-capitalize`}>{this.props.cluster.environment.label} ({this.props.cluster.AwsAccountId})</b>
                            </Link>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Organization
                        </td>
                        <td className="col-9">
                            <Link to={`/organization/${this.props.cluster.organization.organizationUri}`}>
                                <b className={`text-capitalize`}>{this.props.cluster.organization.label}</b>
                            </Link>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Creator
                        </td>
                        <td className="col-9">
                            {this.props.cluster.owner}
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Date Created
                        </td>
                        <td className="col-9">
                            {dayjs(this.props.cluster.created).fromNow() || "-"}
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Node Type
                        </td>
                        <td className="col-9">
                            {this.props.cluster.nodeType || "-"}
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Number of Nodes
                        </td>
                        <td className="col-9">
                            {this.props.cluster.numberOfNodes || "-"}
                        </td>
                    </tr>
                    </tbody>

                </Table>
            </Col>
        </Row>
    }
}

ClusterDetailsGeneralInfo.propTypes = {
    primary: PropTypes.string,
    cluster: PropTypes.func
};

class ClusterDetailsConnection extends Component {
    render() {
        return <Row className={`mt-2`}>
            <Col xs={12}>
                <Table   hover size="sm">
                    <tbody>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Endpoint
                        </td>
                        <td class="col-8">
                            <TruncatedSpan>
                                <b>{`${this.props.cluster.endpoint || "-"}:${this.props.cluster.port}/${this.props.cluster.databaseName}` || "-"}</b>
                            </TruncatedSpan>
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text={`${this.props.cluster.endpoint || "-"}:${this.props.cluster.port}/${this.props.cluster.databaseName}`}>
                                    <Icon.Clipboard onClick={this.props.onClick} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            JDBC
                        </td>
                        <td className="col-8">
                            <b>{`jdbc:redshift://${this.props.cluster.endpoint || "-"}:${this.props.cluster.port}/${this.props.cluster.databaseName}`}</b>
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text= {`jdbc:redshift://${this.props.cluster.endpoint || "-"}:${this.props.cluster.port}/${this.props.cluster.databaseName}`}>
                                    <Icon.Clipboard onClick={this.props.onClick1} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            ODBC
                        </td>
                        <td className="col-8">
                            <b>{`Driver={Amazon Redshift (x64)}; Server=${this.props.cluster.endpoint || "-"}; Database=${this.props.cluster.databaseName}`}</b>
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                   text={`Driver={Amazon Redshift (x64)}; Server=${this.props.cluster.endpoint || "-"}; Database=${this.props.cluster.databaseName}`}>
                                    <Icon.Clipboard onClick={this.props.onClick2} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Master Database
                        </td>
                        <td className="col-8">
                            {this.props.cluster.masterDatabaseName}
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text={this.props.cluster.masterDatabaseName}
                                >
                                    <Icon.Clipboard onClick={this.props.onClick3} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Master User
                        </td>
                        <td className="col-8">
                            {this.props.cluster.masterUsername}
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text={this.props.cluster.masterUsername}
                                >
                                    <Icon.Clipboard onClick={this.props.onClick4} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Master Secret
                        </td>
                        <td className="col-8">
                            {this.props.cluster.masterSecret || '-'}
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text={this.props.cluster.masterSecret}
                                >
                                    <Icon.Clipboard onClick={this.props.onClick5} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Datahub Database
                        </td>
                        <td className="col-8">
                            {this.props.cluster.databaseName || '-'}
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text={this.props.cluster.databaseName || '-'}
                                >
                                    <Icon.Clipboard onClick={this.props.onClick6} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Datahub User
                        </td>
                        <td className="col-8">
                            {this.props.cluster.databaseUser || '-'}
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text={this.props.cluster.databaseUser}
                                >
                                    <Icon.Clipboard onClick={this.props.onClick7} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Datahub Secret
                        </td>
                        <td className="col-8">
                            {this.props.cluster.datahubSecret}
                        </td>
                        <td className="col-1">
                            <SpanZoomer>
                                <CopyToClipboard
                                    text={this.props.cluster.datahubSecret}
                                >
                                    <Icon.Clipboard onClick={this.props.onClick8} className={`mr-1`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        </td>
                    </tr>
                    </tbody>

                </Table>
            </Col>
        </Row>
    }
}

ClusterDetailsConnection.propTypes = {
    cluster: PropTypes.any,
    onClick: PropTypes.func,
    onClick1: PropTypes.func,
    onClick2: PropTypes.func,
    onClick3: PropTypes.func,
    onClick4: PropTypes.func,
    onClick5: PropTypes.func,
    onClick6: PropTypes.func,
    onClick7: PropTypes.func,
    onClick8: PropTypes.func
};

class ClusterDetailsCloudFormation extends Component {
    render() {
        return <Row className={`mt-2`}>
            <Col xs={12}>
                <Table  hover size="sm">
                    <tbody>
                    <tr class="d-flex">
                        <td class="col-3">
                            Stack Status
                        </td>
                        <td class="col-9">
                            <Badge variant={`${this.props.primary} text-uppercase`}
                                   pill>{this.props.cluster.CFNStackStatus || '-'}</Badge>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Stack Name
                        </td>
                        <td class="col-9">
                            <LinkSpan>
                                <b>{this.props.cluster.CFNStackName || '-'}</b>
                            </LinkSpan>
                        </td>
                    </tr>
                    <tr class="d-flex">
                        <td className={`text-capitalize col-3`}>
                            Stack ARN
                        </td>
                        <td class="col-9">
                            <LinkSpan>
                                <b>{this.props.cluster.CFNStackArn || '-'}</b>
                            </LinkSpan>
                        </td>
                    </tr>
                    </tbody>

                </Table>
            </Col>
        </Row>;
    }
}

ClusterDetailsCloudFormation.propTypes = {
    primary: PropTypes.string,
    cluster: PropTypes.any
};

const ClusterDetails= (props)=>{
    let client = useClient();
    const copy=(field)=>{
        toast(`Copied ${field} to clipboard`,{hideProgressBar:true});
    };


    let cluster = props.cluster;
    const statusColor = (status) => {
        let color = 'primary';
        switch (status) {
            case 'available':
                color = 'success';
                break;
            case 'paused':
            case'NOTFOUND':
            case'stopping':
            case'stopped':
                color = 'danger';
                break;
            case 'resuming':
            case 'pausing':
            case 'modifying':
                color = 'warning';
                break;
            default:
                color = 'primary';
        }
        return color;
    };
    const generalInfo=<ClusterDetailsGeneralInfo primary={statusColor(cluster.status)} cluster={cluster}/>;
    const connection=<ClusterDetailsConnection cluster={cluster} onClick={() => {
        copy('Endpoint')
    }} onClick1={() => {
        copy('JDBC')
    }} onClick2={() => {
        copy('ODBC')
    }} onClick3={() => {
        copy('Master Database')
    }} onClick4={() => {
        copy('Master Username')
    }} onClick5={() => {
        copy('Master Secret')
    }} onClick6={() => {
        copy('Datahub Database')
    }} onClick7={() => {
        copy('Datahub Username')
    }} onClick8={() => {
        copy('Datahub Secret')
    }}/>;
    const networking=<ClusterDetailsNetworking cluster={cluster}/>;
    const cloudformation=<ClusterDetailsCloudFormation primary={statusColor(cluster.CFNStackStatus)} cluster={cluster}/>;

    return<DetailStyled> <Container>
        {(!cluster ?(
            <Spinner animation="grow" size="sm" />
        ):(
            <div>
                <FormSection section={`General Information`} content={generalInfo} open={true}/>
                <FormSection section={`Connection`} content={connection} open={true}/>
                <FormSection section={`Networking & Security`} content={networking}/>
                <FormSection section={`CloudFormation`} content={cloudformation}/>
                <Row className={"mt-4"}/>
            </div>
        ))}
    </Container></DetailStyled>
};

export default ClusterDetails;
