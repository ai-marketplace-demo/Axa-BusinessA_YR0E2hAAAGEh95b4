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


const Styled = styled.div`
padding : 0px;
margin: 0;
height__:1.3em;
font-size: 0.9rem;
width:100%;


&:hover{
  background-color: lavender;
  font-weight: bolder;
}

`;


const FacetGroupLine = (props) => {
    console.log('FacetGroupLine ', props.group.dimensionName, props.item.value, props.filters[props.group.dimensionName]);
    let selected = false;
    if (props.filters[props.group.dimensionName]) {
        selected = props.filters[props.group.dimensionName][props.item.value];
    } else {
        selected = false;
    }
    const toggleFilter = () => {
        console.log('clicked item ');
        props.toggleFilter(props.group.dimensionName, props.item.value);
    };
    return (
        <React.Fragment>
            <Styled>
                <Row onClick={toggleFilter}>
                    <Col xs={8}>
                        {props.item.value}
                    </Col>
                    <Col xs={4}>
                        {
                            (selected) ? (
                                <Badge variant={'primary'} size={''}>{props.item.count}</Badge>

                            ) : (
                                <div> {props.item.count}</div>
                            )
                        }
                    </Col>

                </Row>
            </Styled>
        </React.Fragment>
    );
};


export default FacetGroupLine;
