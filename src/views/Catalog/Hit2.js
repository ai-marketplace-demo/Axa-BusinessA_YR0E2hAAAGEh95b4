import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
    If, Then, Else, Switch, Case
} from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from 'react-avatar';
import dayjs from 'dayjs';
import Zoom from '../../components/Zoomer/Zoom';
import Tag from '../../components/Tag/Tag';

const HitStyled = styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-3px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:12rem;
margin-top: 7px;
padding: 1em;
border : 1px solid gainsboro;
border-radius: 8px;

a{
  color :black;
  outline: 0;
}
a:hover, a:link, a:visited{
  text-decoration:none;
  color :black;
}
}
`;


const Hit = (props) => {
    const hit = props.node;
    return (
        <Row className={''}>
            <Col xs={12}>
                <HitStyled>
                    <Row>
                        <Col xs={8}>
                            <Row>
                                <Col xs={1}>
                                    <Avatar className={'mr-1'} size={32} round name={hit.label} />
                                </Col>
                                <Col xs={9}>
                                    <h5>
                                        <Link to={`/dataset/${hit.datasetUri}/overview`}>
                                            xx{hit.label}
                                        </Link>
                                    </h5>
                                </Col>
                            </Row>
                            <Row className={'mt-2'}>
                                <Col xs={4}>
                                    <Icon.Table size={12} /> {hit.statistics.tables} tables
                                </Col>
                                <Col xs={6}>
                                    <Icon.Folder size={12} /> {hit.statistics.locations} locations
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small>
                                        {hit.description.slice(0, 200)}
                                    </small>
                                </Col>
                            </Row>
                            <Row className={'mt-1'}>
                                <Col xs={8}>
                                    {
                                        hit.tags.map((tag) => <Tag tag={tag} />)
                                    }
                                </Col>
                            </Row>

                        </Col>
                        <Col xs={4}>
                            <Row>
                                <Col xs={12}>
                                    <Tag tag={hit.userRoleForDataset || 'undefined'} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small>Created by {hit.owner} {dayjs(hit.created).fromNow()}</small>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small> Org:<b> {hit.organization.label}</b></small>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small> ??Env:<b> {hit.environment.label}</b></small>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <small>Region:<b> {hit.region}</b></small>
                                </Col>
                            </Row>
                            <Row className={'mt-2'}>
                                <Col className={''} xs={12}>
                                    <If condition={['Owner', 'Admin', 'ReadWrite'].indexOf(hit.userRoleForDataset) == -1}>
                                        <Then>

                                            <Link
                                                target="_blank"
                                                style={{ color: 'white' }}
                                                state={{
                                                    dataset: hit
                                                }}
                                                to={{
                                                    pathname: `/newdataaccessrequest/${hit.datasetUri}`
                                                }}
                                            >
                                                <div className={'btn btn-sm bg-white border '}>
                                                    <Icon.PlayFill /> Request Access
                                                </div>

                                            </Link>

                                        </Then>
                                    </If>


                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </HitStyled>
            </Col>
        </Row>
    );
};


export default Hit;
