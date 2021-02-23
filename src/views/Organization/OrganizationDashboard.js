import React, { useState, useEffect } from 'react';
import {
    Container, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import useClient from '../../api/client';


const OrganizationStyled = styled.div`
border-radius: 3px;
height:15rem;
width :100%;
padding: 25px;
margin-top: 5px;
margin-bottom: 5px;
background-color: white;
border: 1px solid lightgrey;
transition: transform 0.2s ease-in-out;
&:hover{
  transform: translateY(-4px);
  box-shadow: 0px 5px 2px lightgrey;

}

`;

const OrganizationDashboard = (props) => {
    const client = useClient();
    const [organizations, setOrganizations] = useState([]);
    const [ready, setReady] = useState(false);


    useEffect(() => {
        if (client) {
            console.log(client);
            client.query({
                query: gql`{
                    listOrganizations{
                        count
                        nodes{
                            organizationUri
                            owner
                            SamlGroupName
                            label
                        }
                    }
                }`
            })
                .then((response) => {
                    console.log('response ==>', response);
                    setReady(true);
                    setOrganizations(response.data.listOrganizations);
                })
                .catch((err) => {
                    console.log('err = ', err);
                });
        }
    }, [client]);

    return (
        <Container>
            <Row>
                <Col xs={3}>
                    <h3> <Icon.House /></h3>
                </Col>
                <Col xs={7}>
                    <h3>Organizations</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={11}>
                    <input style={{ width: '100%' }} placeholder={'search'} />
                </Col>
                <Col xs={1}>
                    <Link to={'/neworganization'}><div className={'btn btn-sm bg-white border'}>Create</div></Link>
                </Col>
            </Row>
            {
                (!ready) ? (
                    <Spinner variant="primary" animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : (
                    <Row className={'mt-3'}>
                        {
                            (!organizations.count) ? (
                                <Col xs={12}>
                                    <i>No Organization found.</i>
                                </Col>

                            ) : (
                                organizations.nodes.map((org) => (
                                    <Col className="" key={org.organizationUri} xs={4}>
                                        <OrganizationStyled>
                                            <Row>
                                                <Col xs={10}>
                                                    <Icon.Gear size={23}></Icon.Gear>
                                                    <h5 className={'ml-2'}>{org.label.toUpperCase()}</h5>
                                                </Col>

                                                <Col xs={2}>
                                                    <Link className="text-black" to={`/editorganization/${org.organizationUri}`}><Icon.Pen /></Link>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={8}>
                                                    <Row>
                                                        <Col>
                                                            <small>Owner: Moshir MIKAEL</small>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <small>Created 23 days ago</small>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={4}>
                                                    <Badge style={{ height: '1.2rem' }} variant={'primary'}><b>Owner</b></Badge>
                                                </Col>

                                            </Row>

                                            <Row className={'mt-2'}>
                                                <Col className={'text-center'} xs={4}> <Link to={{ state: org, pathname: `/organization/${org.organizationUri}/users` }}>Users</Link></Col>
                                                <Col className={'text-center'} xs={4}><Link to={{ state: org, pathname: `/organization/${org.organizationUri}/groups` }}>Groups</Link></Col>
                                                <Col className={'text-center'} xs={4}> <Link to={{ state: org, pathname: `/organization/${org.organizationUri}/environments` }}>Envs</Link></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={4} className={'text-center'}><h3><Badge variant={'primary'}>4</Badge></h3></Col>
                                                <Col xs={4} className={'text-center'}><h3><Badge variant={'secondary'}>4</Badge></h3></Col>
                                                <Col xs={4} className={'text-center'}><h3><Badge variant={'info'}>14</Badge></h3></Col>
                                            </Row>
                                        </OrganizationStyled>
                                    </Col>
                                ))

                            )
                        }

                    </Row>
                )
            }

        </Container>
    );
};


export default OrganizationDashboard;
