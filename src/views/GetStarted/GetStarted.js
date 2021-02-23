import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
    Planet, File, Backpack, Browser
} from 'react-kawaii';
import test from '../../api/Test/test';
import useClient from '../../api/client';


const _Tile = styled.div`
height:22ch;
border-radius: 13px;
__width:100%;
padding: 3%;
_border:lightgrey 1px solid;
transition: transform 0.2s ease-in-out;
&:hover{
  transform: translateY(-5px) ;
  box-shadow:  0px 0px 5px lightgrey;
}
`;

const Tile = styled.div`
transition: transform 0.5s ease-in-out;
&:hover{
  transform: scale(1.1);
  __box-shadow:  0px 0px 5px lightgrey;
}
`;

const GetStarted = () => {
    const client = useClient();


    return (
        <Container fluid>
            <Row className={'mt-5'}>
                <Col xs={12}>
                    <h3>Get started on datahub</h3>
                </Col>
            </Row>
            <Row className={'mt-3'}>
                <Col xs={3}>
                    <Tile>
                        <Row>
                            <Col xs={12}>
                                <Planet size={58} mood="excited" color="#FCCB7E" />
                            </Col>
                            <Col xs={8}>
                                <p className={'mt-2 text-left'}><b>Create an Org</b></p>
                            </Col>
                            <Col xs={12}>
                                Use <b>Organizations</b> to build your teams and connect
                                your <b className={'text-warning'}>AWS</b>  accounts.

                            </Col>
                            <Col xs={12}>
                                <Link to={'/neworganization'}>
                                    start
                                </Link>
                            </Col>


                        </Row>
                        <Row>
                        </Row>

                    </Tile>

                </Col>
                <Col xs={3}>
                    <Tile>
                        <Row>
                            <Col xs={12}>
                                <File size={58} mood="excited" color="#83D1FB" />
                            </Col>
                            <Col xs={8}>
                                <p className={'mt-2 text-left'}><b>Create a Dataset</b></p>
                            </Col>
                            <Col xs={12}>
                                Define your data catalog, store data securely in the <b className={'text-warning'}>AWS</b> cloud
                                and manage data access in one place using <b>Datasets</b>

                            </Col>
                            <Col xs={12}>
                                <Link to={'/newdataset'}>
                                    start
                                </Link>
                            </Col>

                        </Row>
                        <Row>
                        </Row>

                    </Tile>

                </Col>

                <Col xs={3}>
                    <Tile>
                        <Row>
                            <Col xs={12}>
                                <Browser size={58} mood="excited" color="#61DDBC" />
                            </Col>
                            <Col xs={12}>
                                <p className={'mt-2 text-left'}><b>Search the Catalog</b></p>
                            </Col>
                            <Col xs={12}>
                                Looking for a single place where you can discover relevant
                                datasets for your next big idea : head to datahub <b>Catalog</b>


                            </Col>
                            <Col xs={12}>
                                <Link to={'/catalog'}>
                                    start
                                </Link>
                            </Col>

                        </Row>
                        <Row>
                        </Row>

                    </Tile>

                </Col>
                <Col xs={3}>
                    <Tile>
                        <Row>
                            <Col xs={12}>
                                <Backpack size={58} mood="excited" color="#FFD882" />
                            </Col>
                            <Col xs={8}>
                                <p className={'mt-2 text-left'}><b>Play with data!</b></p>
                            </Col>
                            <Col xs={12}>
                                <b>Blueprints</b> are the place where you can use the <b className={'text-warning'}>AWS</b>  cloud to
                                mix and match datasets that you own or that were shared

                            </Col>
                            <Col xs={12}>
                                <Link to={'/newproject'}>
                                    start
                                </Link>
                            </Col>

                        </Row>
                        <Row>
                        </Row>

                    </Tile>

                </Col>


            </Row>
            <Row className={'mt-3'}>

            </Row>
        </Container>
    );
};


export default GetStarted;
