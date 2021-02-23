import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import Select from 'react-select';
import * as Icon from 'react-bootstrap-icons';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useClient from '../../../api/client';
import ProjectContributorListItem from '../ProjectContributors/ProjectContributorListItem';

dayjs.extend(relativeTime);

const Styled = styled.div`
__border-radius: 4px;
min-height: 7rem;
padding: 11px;
border : 1px solid lightgrey;
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-3px);
  box-shadow: 0px 5px 2px lightgrey;
  
}
`;


const ProjectDatasetListItem = (props) => (
    <Styled>
        <Row>
            <Col xs={4}>
                <Link to={`/dataset/${props.dataset.datasetUri}/overview`}>
                    <h5><Icon.Folder /> <b className={'text-primary'}>
                        {props.dataset.label}
                                        </b>
                    </h5>
                </Link>
            </Col>
            <Col xs={2} />
            <Col xs={3}><Icon.Grid size={18} /> Tables</Col>
            <Col xs={3}><Icon.Folder size={18} /> Storage Locations</Col>
        </Row>
        <Row>
            <Col xs={6}>
                <b>{props.dataset.organization.label}</b> | <b> {props.dataset.owner} </b> | <b>{dayjs(new Date()).fromNow()}</b>
            </Col>
            <Col xs={3}>222 </Col>
            <Col xs={3}>222 </Col>
        </Row>

        <Row className={'mt-2'}>
            <Col xs={8}>
                <small>
                    {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                </small>
            </Col>
            <Col xs={2} />
            <Col xs={2}>
                <div className={'btn btn-primary btn-sm'}>
                    Unlink
                </div>
            </Col>
        </Row>
    </Styled>
);


export default ProjectDatasetListItem;
