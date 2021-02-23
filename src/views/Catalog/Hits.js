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
import Hit from './Hit';


const Hits = (props) => (
    <React.Fragment>
        {
            props.hits.nodes && props.hits.nodes.map((node) => <Hit {...props} node={node} />)
        }
    </React.Fragment>
);


export default Hits;
