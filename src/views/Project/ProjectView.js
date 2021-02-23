import React, { useState } from 'react';
import styled from 'styled-components';
import {
    Row, Container, Col, ListGroup, ListGroupItem
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    useParams,
    useRouteMatch
} from 'react-router-dom';
import Tabs from '../../components/Tabs/Tabs';

const Circled = styled.div`
margin-top: 25%;
width : 42px;
height: 42px;
border-radius: 50%;   
border : 1px solid lightgray;
text-align: center;
padding-top: 5px;
&:hover{
  box-shadow: 0px 2px 1px 2px lightcyan;
}
`;


const FullScreen = styled.div`
position : fixed;
top : 1%;
z-index: 10;
width: 75%;
margin-left: 0%;
__border : 1px solid black;
background-color: white;
height: 200vh;
`;


const ProjectView = (props) => {
    const { path, url } = useRouteMatch();
    const [view, selectView] = useState('overview');
    const selectTab = (name) => {
        selectView(name);
    };
    console.log('path, url ', path, url);
    return (
        <FullScreen>
            <Container className={'m-0 p-0'}>
                <Row className={'border-bottom'}>
                    <Col xs={4}>
                        <Row>
                            <Col className="pt-3" xs={2}>
                                <Icon.SkipEnd size={32} />
                            </Col>
                            <Col xs={10}>
                                <Row>
                                    <h4>My Project</h4>
                                </Row>
                                <Row>
                                    <p>by <a href={'#'}>@moshirm</a></p>
                                </Row>

                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={'pt-3'}>
                    <Col xs={10}>
                        <Tabs tabs={['Overview', 'Contributors', 'Datasets', 'Queries', 'Pipelines', 'Integrations', 'Discussions']} />
                    </Col>
                </Row>


                <Row className={'mt-2'}>
                    <Col xs={10}>
                    </Col>
                </Row>
            </Container>
        </FullScreen>
    );
};


export default ProjectView;
