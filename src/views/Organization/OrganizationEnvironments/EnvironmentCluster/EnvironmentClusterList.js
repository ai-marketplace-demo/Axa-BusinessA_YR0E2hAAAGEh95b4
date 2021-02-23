import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import { Link, useParams, useLocation } from 'react-router-dom';
import EnvironmentClusterListItem from './EnvironmentClusterListItem';


const Background = styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 4px;
background-color: white;
border : 1px solid lightgrey;
padding: 16px;
width:100%;
}
`;

const EnvironmentClusterList = (props) => {
    const location = useLocation();
    const params = useParams();
    const [ready, setReady] = useState(false);
    const [clusters, setClusters] = useState([]);
    useEffect(() => {
        const endpoint = 'cdhredshiftcluster0xed4.c8hbq2jt8ez3.eu-west-1.redshift.amazonaws.com';
        setTimeout(() => {
            setClusters([
                {
                    endpoint, clusterUri: 'clstr1', label: 'cluster1', name: 'cluster1', owner: 'xxx'
                },
                {
                    endpoint, clusterUri: 'clstr2', label: 'cluster2', name: 'cluster1', owner: 'xxx'
                },
                {
                    endpoint, clusterUri: 'clstr3', label: 'cluster3', name: 'cluster1', owner: 'xxx'
                },
            ]);
            setReady(true);
        }, 1000);
    }, []);

    const { organization } = location.state;
    const { environment } = location.state;
    console.log('loc =', location.state);
    return (
        <Container>
            <Row>
                <Col xs={1}>
                    <Row>
                        <Col className="text-left" xs={12}>
                            <Link
                                style={{ color: 'black' }}
                                to={{
                                    state: location.state.organization,
                                    pathname: `/organization/${organization.organizationUri}/environments`
                                }}
                            ><Icon.ChevronLeft size={36} />
                            </Link>
                        </Col>
                    </Row>
                </Col>
                <Col xs={10}>
                    <h3>  Clusters in Environment <b className={'text-secondary'}>{environment.label.toUpperCase()}</b>
                        (in Organization <b className={'text-primary'}>{organization.label}</b>)
                    </h3>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={1} />
                <Col xs={5}>
                    <input placeholder={'search clusters'} style={{ width: '100%' }} />
                </Col>
                <Col xs={3} />
                <Col xs={2}>
                    <div className={'btn border btn-sm btn-white'}>
                        <Link
                            style={{ color: 'black' }}
                            to={{
                                state: location.state,
                                pathname: `/newenvironmentcluster/${params.uri}`
                            }}
                        ><Icon.Plus size={18} /> Import
                        </Link>
                    </div>
                </Col>
            </Row>
            <Row className={'mt-2'}>
                <Col xs={1} />
                <Col xs={10}>
                    <Background>
                        {
                            (!ready) ? (
                                <Spinner variant="primary" animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>

                            ) : (
                                <Row>
                                    {clusters.map((cluster) => (
                                        <Col className={'mt-1'} key={cluster.clusterUri} xs={12}>
                                            <EnvironmentClusterListItem cluster={cluster} />
                                        </Col>
                                    ))}
                                </Row>


                            )
                        }
                    </Background>

                </Col>

            </Row>
        </Container>
    );
};

export default EnvironmentClusterList;
