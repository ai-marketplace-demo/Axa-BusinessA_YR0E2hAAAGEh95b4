import React, { useState, useEffect, Component } from 'react';
import {
    Container, Spinner, Button, Form, Card, Row, Col, Table
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as PropTypes from 'prop-types';
import SpanZoomer from '../../components/Zoomer/SpanZoomer';
import getRedshiftClusterDatabaseCredentials from '../../api/RedshiftCluster/getClusterDatabaseCredentials';
import searchRedshiftClusters from '../../api/RedshiftCluster/searchClusters';
import useClient from '../../api/client';
import FormSection from '../../components/FormSection/FormSection';

dayjs.extend(relativeTime);


const DetailStyled = styled.div`
height:100vh;
`;

const InfoSpan = styled.span`
color: #545b64;
font-weight: bold;
`;
const TruncatedSpan = styled.span`
white-space:nowrap;
 overflow:hidden;
 text-overflow:ellipsis;
`;
class ClusterCredentialsSection extends Component {
    render() {
        return (
            <Row className={'mt-2'}>
                <Col xs={12}>
                    <Table hover size="sm">
                        <tbody>
                            <tr className="d-flex">
                                <td className={'text-capitalize col-3'}>
                                    Endpoint
                                </td>
                                <td className="col-8">
                                    <TruncatedSpan>
                                        {`${this.props.cluster.endpoint || '-'}:${this.props.cluster.port}/${this.props.cluster.databaseName}` || '-'}
                                    </TruncatedSpan>
                                </td>
                                <td className="col-1">
                                    <SpanZoomer>
                                        <CopyToClipboard
                                            text={`${this.props.cluster.endpoint || '-'}:${this.props.cluster.port}/${this.props.cluster.databaseName}`}
                                        >
                                            <Icon.Clipboard onClick={this.props.onClick} className={'mr-1'} />
                                        </CopyToClipboard>
                                    </SpanZoomer>
                                </td>
                            </tr>
                            <tr className="d-flex">
                                <td className={'text-capitalize col-3'}>
                                    JDBC
                                </td>
                                <td className="col-8">
                                    {`jdbc:redshift://${this.props.cluster.endpoint || '-'}:${this.props.cluster.port}/${this.props.cluster.databaseName}`}
                                </td>
                                <td className="col-1">
                                    <SpanZoomer>
                                        <CopyToClipboard
                                            text={`jdbc:redshift://${this.props.cluster.endpoint || '-'}:${this.props.cluster.port}/${this.props.cluster.databaseName}`}
                                        >
                                            <Icon.Clipboard onClick={this.props.onClick1} className={'mr-1'} />
                                        </CopyToClipboard>
                                    </SpanZoomer>
                                </td>
                            </tr>
                            <tr className="d-flex">
                                <td className={'text-capitalize col-3'}>
                                    ODBC
                                </td>
                                <td className="col-8">
                                    {`Driver={Amazon Redshift (x64)}; Server=${this.props.cluster.endpoint || '-'}; Database=${this.props.cluster.databaseName}`}
                                </td>
                                <td className="col-1">
                                    <SpanZoomer>
                                        <CopyToClipboard
                                            text={`Driver={Amazon Redshift (x64)}; Server=${this.props.cluster.endpoint || '-'}; Database=${this.props.cluster.databaseName}`}
                                        >
                                            <Icon.Clipboard onClick={this.props.onClick2} className={'mr-1'} />
                                        </CopyToClipboard>
                                    </SpanZoomer>
                                </td>
                            </tr>
                            <tr className="d-flex">
                                <td className={'text-capitalize col-3'}>
                                    Database
                                </td>
                                <td className="col-8">
                                    {this.props.cluster.databaseName || '-'}
                                </td>
                                <td className="col-1">
                                    <SpanZoomer>
                                        <CopyToClipboard
                                            text={this.props.cluster.databaseName || '-'}
                                        >
                                            <Icon.Clipboard onClick={this.props.onClick3} className={'mr-1'} />
                                        </CopyToClipboard>
                                    </SpanZoomer>
                                </td>
                            </tr>
                            <tr className="d-flex">
                                <td className={'text-capitalize col-3'}>
                                    User
                                </td>
                                <td className="col-8">
                                    {this.props.cluster.databaseUser || '-'}
                                </td>
                                <td className="col-1">
                                    <SpanZoomer>
                                        <CopyToClipboard
                                            text={this.props.cluster.databaseUser}
                                        >
                                            <Icon.Clipboard onClick={this.props.onClick4} className={'mr-1'} />
                                        </CopyToClipboard>
                                    </SpanZoomer>
                                </td>
                            </tr>
                            <tr className="d-flex">
                                <td className={'text-capitalize col-3'}>
                                    Password
                                </td>
                                <td className="col-8">
                                    {this.props.clusterCreds.password || '-'}
                                </td>
                                <td className="col-1">
                                    <SpanZoomer>
                                        <CopyToClipboard
                                            text={this.props.clusterCreds.password}
                                        >
                                            <Icon.Clipboard onClick={this.props.onClick5} className={'mr-1'} />
                                        </CopyToClipboard>
                                    </SpanZoomer>
                                </td>
                            </tr>
                        </tbody>

                    </Table>
                </Col>
            </Row>
        );
    }
}

ClusterCredentialsSection.propTypes = {
    cluster: PropTypes.any,
    onClick: PropTypes.func,
    onClick1: PropTypes.func,
    onClick2: PropTypes.func,
    onClick3: PropTypes.func,
    onClick4: PropTypes.func,
    onClick5: PropTypes.func,
};

const ClusterCredentials = (props) => {
    const client = useClient();
    const copy = (field) => {
        toast(`Copied ${field} to clipboard`, { hideProgressBar: true });
    };

    const [clusterCreds, setClusterCreds] = useState({ password: '-' });
    const { cluster } = props;
    useEffect(() => {
        if (client && cluster) {
            getCreds();
        }
    }, [client]);

    const getCreds = async () => {
        const response = await client.query(
            getRedshiftClusterDatabaseCredentials(cluster.clusterUri)
        );
        if (!response.errors) {
            setClusterCreds({ ...response.data.getRedshiftClusterDatabaseCredentials });
            console.log('cluster credentials = ', clusterCreds);
        } else {
            toast.error(`Could not retrieve cluster credentials ,${response.errors[0].message}`);
        }
    };
    const connection = (
        <ClusterCredentialsSection
            cluster={cluster}
            clusterCreds={clusterCreds}
            onClick={() => {
                copy('Endpoint');
            }}
            onClick1={() => {
                copy('JDBC');
            }}
            onClick2={() => {
                copy('ODBC');
            }}
            onClick3={() => {
                copy('Database');
            }}
            onClick4={() => {
                copy('User');
            }}
            onClick5={() => {
                copy('Password');
            }}
        />
    );
    return (
        <DetailStyled> <Container>
            {(!cluster ? (
                <Spinner animation="grow" size="sm" />
            ) : (
                <div>
                    <FormSection section={'Datahub Database'} content={connection} open />
                </div>
            ))}
                       </Container>
        </DetailStyled>
    );
};

export default ClusterCredentials;
