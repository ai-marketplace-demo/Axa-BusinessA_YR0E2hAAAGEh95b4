import React, { useEffect, useState } from 'react';
import {
    Row, Col, Spinner, Container
} from 'react-bootstrap';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import * as Icon from 'react-bootstrap-icons';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
    If, Then, Case, Else
} from 'react-if';
import { toast } from 'react-toastify';
import getAuthorSession from '../../api/Dashboard/getDashboardAuthorSession';
import getReaderSession from '../../api/Dashboard/getDashboardReaderSession';
import useClient from '../../api/client';

const QuickSightEmbedding = require('amazon-quicksight-embedding-sdk');


const Embedded = (props) => {
    const dashboardRef = React.createRef();

    const embed = () => {
        const options = {
            url: props.sessionUrl,
            container: dashboardRef.current,
            scrolling: 'no',
            height: '700px',
            width: '1000px',
            locale: 'en-US',
            footerPaddingEnabled: true
        };
        const dashboard = QuickSightEmbedding.embedDashboard(options);
    };

    useEffect(() => {
        embed();
    });
    if (!props.sessionUrl) {
        return <div />;
    }
    return <div ref={dashboardRef} />;
};


const QuicksightDesigner = (props) => {
    // const [sessionUrl, setSessionUrl] = useState(null);
    const [dashboardRef, setDashboardRef] = useState(React.createRef());
    // const [dashboardRefEmpty= React.createRef();
    const [rendered, setRendered] = useState(false);

    const embed = () => {
        if (!rendered) {
            setRendered(true);
            const options = {
                url: props.sessionUrl,
                container: dashboardRef.current,
                scrolling: 'no',
                // height: "700px",
                height: 'AutoFit',
                maximize: true,
                // loadingHeight: "700px",
                // width: "100%",
                locale: 'en-US',
                footerPaddingEnabled: true
            };
            const dashboard = QuickSightEmbedding.embedDashboard(options);
        }
    };

    useEffect(() => {
        if (props.sessionUrl) {
            embed();
        }
    });

    if (!props.sessionUrl) {
        return (
            <Container className={'mt-3s'}>
                <Row>
                    <Col>
                        <Spinner variant={'secondary'} animation={'border'} size={'sm'} />
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className={'bg-white'}>
            <If condition={!props.sessionUrl}>
                <Then>

                </Then>
                <Else>

                    <Row className={'mt-4'}>
                        <Col className={'bg-white'} xs={12}>
                            {/**
                         <Embedded sessionUrl={props.sessionUrl}/>
                         * */}
                            <a target={'_blank'} href={props.sessionUrl}>
                                View In Quicksight
                            </a>
                            <Col xs={12} ref={dashboardRef} />
                        </Col>
                    </Row>
                </Else>
            </If>

        </Container>
    );
};

export default QuicksightDesigner;
