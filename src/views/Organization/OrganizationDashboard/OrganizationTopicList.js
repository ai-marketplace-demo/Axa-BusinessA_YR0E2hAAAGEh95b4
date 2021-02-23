import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import { Else, If, Then } from 'react-if';
import MainButton from '../../../components/MainActionButton/MainButton';
import listOrganizationTopics from '../../../api/Organization/listOrganizationTopics';

import useClient from '../../../api/client';

const OrganizationTopicList = (props) => {
    const client = useClient();
    const params = useParams();
    const [topics, setTopics] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: []
    });

    const fetchTopics = async () => {
        const response = await client.query(listOrganizationTopics({
            organizationUri: params.uri,
            filter: { page: topics.page }
        }));
        if (!response.errors) {
            setTopics({ ...response.data.listOrganizationTopics });
        } else {
            toast(`Could not retrieve topics, received ${response.errors[0].message}`);
        }
    };
    useEffect(() => {
        if (client) {
            fetchTopics();
        }
    }, [client]);
    return (
        <div>

            <Row className={'mt-4'}>
                <Col xs={4}>
                    Found {topics.count} topics
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={2}>
                            <Icon.ChevronLeft />
                        </Col>
                        <Col xs={6}>
                            Page {topics.page}/{topics.pages}
                        </Col>
                        <Col xs={2}>
                            <Icon.ChevronRight />
                        </Col>
                    </Row>
                </Col>
                <Col xs={2}>
                    <Link to={`/organization/${props.organization.organizationUri}/dashboard/newtopic`}>
                        <MainButton>Create</MainButton>
                    </Link>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col xs={12}>
                    <If condition={topics.count}>
                        <Then>
                            <table className={'table table-sm'}>
                                <tr>
                                    <th>
                                        Topic
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tbody>
                                    {
                                        topics.nodes.map((topic) => (
                                            <tr>
                                                <td>
                                                    {topic.label}
                                                </td>
                                                <td>
                                                    {topic.description}
                                                </td>
                                                <td>
                                                    <Link to={`/organization/${params.uri}/dashboard/topic/${topic.topicUri}`}>
                                                        <div className={'btn btn-sm bg-white border'}>Edit</div>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <div className={'btn btn-sm bg-white border'}>Delete</div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                        </Then>
                        <Else>

                        </Else>
                    </If>
                </Col>
            </Row>
        </div>
    );
};


export default OrganizationTopicList;
