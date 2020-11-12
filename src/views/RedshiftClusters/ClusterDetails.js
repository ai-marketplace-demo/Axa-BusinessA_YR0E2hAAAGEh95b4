import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge, Card, DropdownButton, Dropdown} from "react-bootstrap";
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

    return<DetailStyled> <Container>
        {(!cluster ?(
            <Spinner animation="grow" size="sm" />
        ):(
            <div>
                <Card className={"mt-4"}>
                    <Card.Header>
                        <b>General Information</b>
                    </Card.Header>
                    <Card.Body>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Status</InfoSpan>
                                </Row>
                                <Row>
                                    <Badge variant={`${statusColor(cluster.status)} text-uppercase`} pill>{cluster.status}</Badge>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Environment</InfoSpan>
                                </Row>
                                <Row>
                                    <Link to={`/playground/${cluster.environment.environmentUri}`}>
                                        <b className={`text-capitalize`}>{cluster.environment.label} ({cluster.AwsAccountId})</b>
                                    </Link>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>Organization</InfoSpan>
                                </Row>
                                <Row>
                                    <Link to={`/organization/${cluster.organization.organizationUri}`}>
                                        <b className={`text-capitalize`}>{cluster.organization.label}</b>
                                    </Link>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Identifier</InfoSpan>
                                </Row>
                                <Row>
                                    <code>{cluster.name}</code>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Creator</InfoSpan>
                                </Row>
                                <Row>
                                    <span><b>{cluster.owner}</b></span>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>Date Created</InfoSpan>
                                </Row>
                                <Row>
                                    <span><b>{dayjs(cluster.created).fromNow() || '-'}</b></span>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Node Types</InfoSpan>
                                </Row>
                                <Row>
                                    <span><b>{cluster.nodeType || '-'}</b></span>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Number of Nodes</InfoSpan>
                                </Row>
                                <Row>
                                    <span><b>{cluster.numberOfNodes || '-'}</b></span>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>Region</InfoSpan>
                                </Row>
                                <Row>
                                    <span><b>{cluster.region || '-'}</b></span>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className={"mt-4"}>
                    <Card.Header>
                        <b>Connection</b>
                    </Card.Header>
                    <Card.Body>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Endpoint</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <SpanZoomer>
                                            <CopyToClipboard text={`${cluster.endpoint || '-'}:${cluster.port}/${cluster.masterDatabaseName}`}>
                                                <Icon.Clipboard onClick={()=>{copy('Endpoint')}} className={`mr-1`}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>

                                        <code>{`${cluster.endpoint || '-'}:${cluster.port}/${cluster.masterDatabaseName}`|| '-'}</code>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>JDBC URL</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <CopyToClipboard text={`jdbc:redshift://${cluster.endpoint || '-'}:${cluster.port}/${cluster.masterDatabaseName}`}>
                                            <SpanZoomer><Icon.Clipboard onClick={()=>{copy('JDBC')}} className={`mr-1`}/></SpanZoomer>
                                        </CopyToClipboard>

                                        <code>{`jdbc:redshift://${cluster.endpoint || '-'}:${cluster.port}/${cluster.masterDatabaseName}`|| '-'}</code>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>ODBC URL</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <CopyToClipboard text={`Driver={Amazon Redshift (x64)}; Server=${cluster.endpoint || '-'}; Database=${cluster.masterDatabaseName}`}>
                                            <SpanZoomer><Icon.Clipboard onClick={()=>{copy('ODBC')}} className={`mr-1`}/></SpanZoomer>
                                        </CopyToClipboard>
                                        <code>{`Driver={Amazon Redshift (x64)}; Server=${cluster.endpoint || '-'}; Database=${cluster.masterDatabaseName}`}</code>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Master Database</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <CopyToClipboard text={`${cluster.masterDatabaseName || '-'}`}>
                                            <SpanZoomer><Icon.Clipboard onClick={()=>{copy('Master Database')}} className={`mr-1`}/></SpanZoomer>
                                        </CopyToClipboard>
                                        <b>{`${cluster.masterDatabaseName || '-'}`}</b>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Master Username</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <CopyToClipboard text={`${cluster.masterUsername}`}>
                                            <SpanZoomer>
                                                <Icon.Clipboard onClick={()=>{copy('Master Username')}} className={`mr-1`}/>
                                            </SpanZoomer>
                                        </CopyToClipboard>
                                        <b>{`${cluster.masterUsername || '-'}`}</b>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>Master Secret</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <CopyToClipboard text={`${cluster.masterSecret}`}>
                                            <SpanZoomer>
                                                <Icon.Clipboard onClick={()=>{copy('Master Secret')}} className={`mr-1`}/>
                                            </SpanZoomer>
                                        </CopyToClipboard>
                                        <b>{`${cluster.masterSecret || '-'}`}</b>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Datahub Database</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <CopyToClipboard text={`${cluster.databaseName}`}>
                                            <SpanZoomer>
                                                <Icon.Clipboard onClick={()=>{copy('Datahub Database')}} className={`mr-1`}/>
                                            </SpanZoomer>
                                        </CopyToClipboard>
                                        <b>{`${cluster.databaseName || '-'}`}</b>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Datahub Username</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <SpanZoomer>
                                            <CopyToClipboard text={`${cluster.databaseUser || '-'}`}>
                                                <Icon.Clipboard onClick={()=>{copy('Datahub Username')}} className={`mr-1`}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        <b>{`${cluster.databaseUser || '-'}`}</b>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>Database Secret</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan>
                                        <SpanZoomer>
                                            <CopyToClipboard text={`${cluster.datahubSecret}`}>
                                                <Icon.Clipboard onClick={()=>{copy('Datahub Secret')}} className={`mr-1`}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        <b>{`${cluster.datahubSecret || '-'}`}</b>
                                    </TruncatedSpan>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className={"mt-4"}>
                    <Card.Header>
                        <b>Networking & Security</b>
                    </Card.Header>
                    <Card.Body>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>VPC</InfoSpan>
                                </Row>
                                <Row>
                                    <b>{cluster.vpc || '-'}</b>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Subnet Group</InfoSpan>
                                </Row>
                                <Row>
                                    <span><b>{cluster.subnetGroupName || '-'}</b></span>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>Security Group</InfoSpan>
                                </Row>
                                <Row>
                                    <b>{cluster.securityGroupIds ? cluster.securityGroupIds[0] : '-'}</b>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>KMS Alias</InfoSpan>
                                </Row>
                                <Row>
                                    <b>{cluster.kmsAlias || '-'}</b>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>CloudFormation Stack</InfoSpan>
                                </Row>
                                <Row>
                                    <b>{cluster.CFNStackName || '-'}</b>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>IAM Roles</InfoSpan>
                                </Row>
                                <Row>
                                    <TruncatedSpan><b>{cluster.IAMRoles ? cluster.IAMRoles[0] : '-'}</b></TruncatedSpan>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className={"mt-4"}>
                    <Card.Header>
                        <b>CloudFormation</b>
                    </Card.Header>
                    <Card.Body>
                        <Row className={"mt-2"}>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Stack Status</InfoSpan>
                                </Row>
                                <Row>
                                    <Badge variant={`${statusColor(cluster.CFNStackStatus)} text-uppercase`} pill>{cluster.CFNStackStatus}</Badge>
                                </Row>
                            </Col>
                            <Col xs={4} className={"ml-3 border-right"}>
                                <Row>
                                    <InfoSpan>Stack Name</InfoSpan>
                                </Row>
                                <Row>
                                    <LinkSpan>
                                        <b>{cluster.CFNStackName}</b>
                                    </LinkSpan>
                                </Row>
                            </Col>
                            <Col xs={2} className={"ml-3"}>
                                <Row>
                                    <InfoSpan>Stack ARN</InfoSpan>
                                </Row>
                                <Row>
                                    <LinkSpan>
                                        <b>{cluster.CFNStackArn}</b>
                                    </LinkSpan>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            <Row className={"mt-4"}/>
            </div>
        ))}
    </Container></DetailStyled>
};

export default ClusterDetails;
