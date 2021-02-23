import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Spinner, Badge, Form
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {
    BrowserRouter, Route, Link, Switch
} from 'react-router-dom';
import styled from 'styled-components';
import Avatar from 'react-avatar';
import Zoom from '../../components/Zoomer/Zoom';
import FacetGroupLine from './FacetGroupLine';


const Styled = styled.div`
padding : 0px;
margin: 0;
margin-bottom: 0.5rem;


`;


const FacetGroup = (props) => (
    <React.Fragment>
        <Styled>
            <Row>
                <Col xs={12}>
                    <b className={'text-capitalize'}>{props.group.dimensionName}</b>
                </Col>
            </Row>
            {
                props.group.items && props.group.items.map((item) => <FacetGroupLine {...props} item={item} />)
            }
        </Styled>
    </React.Fragment>
);


export default FacetGroup;
