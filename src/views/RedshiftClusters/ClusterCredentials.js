import React,{useState,useEffect} from "react";
import {Container, Spinner, Button, Form, Card, Row, Col} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import styled from "styled-components"
import useClient from "../../api/client";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import dayjs from "dayjs"
import SpanZoomer from "../../components/Zoomer/SpanZoomer";
import relativeTime from "dayjs/plugin/relativeTime";
import getRedshiftClusterDatabaseCredentials from "../../api/RedshiftCluster/getClusterDatabaseCredentials";
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

const ClusterCredentials = (props)=>{
    let client = useClient();
    const copy=(field)=>{
        toast(`Copied ${field} to clipboard`,{hideProgressBar:true});
    };

    let [clusterCreds, setClusterCreds] = useState({password: '-'});
    let cluster = props.cluster;
    useEffect(() => {
        if (client && cluster) {
            client
                .query(getRedshiftClusterDatabaseCredentials(cluster.clusterUri))
                .then((response) => {
                    setClusterCreds({...response.data.getRedshiftClusterDatabaseCredentials});
                    console.log("cluster creds = ", clusterCreds);
                }).catch((e) => {
                toast(`Could not retrieve cluster details , received ${e.message}`)
            });
        }
    }, [client]);


    return<DetailStyled> <Container>
        {(!cluster ?(
            <Spinner animation="grow" size="sm" />
        ):(
            <div>
                <Card className={"mt-4"}>
                    <Card.Header>
                        <b>[d]atahub Database</b>
                    </Card.Header>
                    <Card.Body>
                        <Row className={"mt-2"}>
                            <Col xs={12} className={'ml-2'}>
                                <Row>
                                    <InfoSpan>Endpoint</InfoSpan>
                                </Row>
                                <Row>
                                    <span>
                                        <SpanZoomer className={'mr-2'}>
                                            <CopyToClipboard text={`${cluster.endpoint}:${cluster.port}/${cluster.databaseName}`}>
                                                <Icon.Clipboard onClick={()=>{copy('Endpoint')}}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        <b>{`${cluster.endpoint}:${cluster.port}/${cluster.databaseName}`}</b>
                                    </span>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-4"}>
                            <Col xs={12} className={'ml-2'}>
                                <Row>
                                    <InfoSpan>JDBC URL</InfoSpan>
                                </Row>
                                <Row>
                                    <span>
                                        <SpanZoomer className={'mr-2'}>
                                            <CopyToClipboard text={`jdbc:redshift://${cluster.endpoint || '-'}:${cluster.port}/${cluster.databaseName}`}>
                                                <Icon.Clipboard  className={`mr-1`} onClick={()=>{copy('JDBC')}}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        <b>{`jdbc:redshift://${cluster.endpoint || '-'}:${cluster.port}/${cluster.databaseName}`|| '-'}</b>
                                    </span>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-4"}>
                            <Col xs={12} className={'ml-2'}>
                                <Row>
                                    <InfoSpan>ODBC URL</InfoSpan>
                                </Row>
                                <Row>
                                    <span>
                                        <SpanZoomer className={'mr-2'}>
                                            <CopyToClipboard text={`Driver={Amazon Redshift (x64)}; Server=${cluster.endpoint || '-'}; Database=${cluster.databaseName}`}>
                                                <Icon.Clipboard  className={`mr-1`} onClick={()=>{copy('ODBC')}} />
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        <b>{`Driver={Amazon Redshift (x64)}; Server=${cluster.endpoint || '-'}; Database=${cluster.databaseName}`}</b>
                                    </span>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-4"}>
                            <Col xs={12} className={'ml-2'}>
                                <Row>
                                    <InfoSpan>Database</InfoSpan>
                                </Row>
                                <Row>
                                    <b>
                                        <SpanZoomer className={'mr-2'}>
                                            <CopyToClipboard text={cluster.databaseName}>
                                                <Icon.Clipboard  className={`mr-1`} onClick={()=>{copy('Database')}}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        {cluster.databaseName}
                                    </b>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-4"}>
                            <Col xs={12} className={'ml-2'}>
                                <Row>
                                    <InfoSpan>Username</InfoSpan>
                                </Row>
                                <Row>
                                    <b>
                                        <SpanZoomer className={'mr-2'}>
                                            <CopyToClipboard text={cluster.databaseUser}>
                                                <Icon.Clipboard  className={`mr-1`} onClick={()=>{copy('Username')}}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        {cluster.databaseUser}
                                    </b>
                                </Row>
                            </Col>
                        </Row>
                        <Row className={"mt-4"}>
                            <Col xs={12} className={'ml-2'}>
                                <Row>
                                    <InfoSpan>Password</InfoSpan>
                                </Row>
                                <Row>
                                    <b>
                                        <SpanZoomer className={'mr-2'}>
                                            <CopyToClipboard text={clusterCreds.password}>
                                                <Icon.Clipboard  className={`mr-1`} onClick={()=>{copy('Password')}}/>
                                            </CopyToClipboard>
                                        </SpanZoomer>
                                        {clusterCreds.password}
                                    </b>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        ))}
    </Container></DetailStyled>
};

export default ClusterCredentials;
