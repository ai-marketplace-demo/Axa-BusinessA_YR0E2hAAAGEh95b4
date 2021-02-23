import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import useClient from '../../api/client';
import searchOutbox from '../../api/DataAccessRequest/searchOutbox.js';
import Message from './Message';


const Outbox = (props) => {
    const client = useClient();
    const [shareObjects, setShareObjects] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });


    const fetchItems = async () => {
        const response = await client.query(
            searchOutbox({
                filter: {
                    page: shareObjects.page,
                    pageSize: 5
                }
            })
        );
        if (!response.errors) {
            setShareObjects({ ...response.data.requestsFromMe });
        } else {
            toast(`Could not retrieve outbox message, received ${response.errors[0].message}`);
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, shareObjects.page]);


    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h5><b className={'text-primary'}>Outbox</b> Data Access Requests Submitted By Me</h5>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={3}>
                    <i>Found {shareObjects.count} results</i>
                </Col>
                <Col xs={8}>
                    <Row>
                        <Col className={'pt-2 text-right'} xs={1}>
                            <Icon.ChevronLeft />
                        </Col>
                        <Col className={'text-center'} xs={3}>
                            Page {shareObjects.page}/{shareObjects.pages}
                        </Col>
                        <Col className={'pt-2 text-left'} xs={1}>
                            <Icon.ChevronRight />
                        </Col>

                    </Row>
                </Col>

            </Row>
            <Row className={'mt-2'}>
                <Col xs={12}>
                    <table className={'table table-sm'}>
                        <tr>
                            <th>
                                Received
                            </th>
                            <th>
                                From
                            </th>
                            <th>
                                Object
                            </th>
                            <th>
                                Status
                            </th>
                            <th>
                                Details
                            </th>
                        </tr>
                        {
                            shareObjects.nodes.map((shareObject) => (
                                <Message
                                    key={shareObject.shareUri}
                                    shareObject={shareObject}
                                />
                            ))
                        }
                    </table>
                </Col>
            </Row>
        </Container>
    );
};


export default Outbox;
