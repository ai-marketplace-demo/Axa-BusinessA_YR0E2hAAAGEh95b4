import React, { useState } from 'react';
import { If, Then, Else } from 'react-if';
import {
    Container, Row, Col, Table
} from 'react-bootstrap';
import dayjs from 'dayjs';
import EasyEdit, { Types } from 'react-easy-edit';
import UserProfileLink from '../../Profile/UserProfileLink';
import { AwsRegions as regions } from '../../../components/AwsRegions/AwsRegionsData';


const General = (props) => {
    const { canEdit } = props;
    return (
        <Row className={'mt-2'}>
            <Col xs={12}>
                <Table striped bordered hover size="sm">
                    <tr>
                        <td className={'text-capitalize'}>
                            Name
                        </td>
                        <td>
                            {props.dataset.label}
                        </td>
                    </tr>
                    <tr scope="row">
                        <td className={'text-capitalize'}>
                            Description
                        </td>
                        <td>
                            <If condition={canEdit}>
                                <Then>
                                    <EasyEdit
                                        attributes={{ name: 'description' }}
                                        type={Types.TEXT}
                                        onSave={props.handleEdit('description')}
                                        value={props.dataset.description}
                                    >
                                    </EasyEdit>

                                </Then>
                                <Else>
                                    <p>{props.dataset.description}</p>
                                </Else>
                            </If>
                        </td>
                    </tr>
                    <tr scope="row">
                        <td className={'text-capitalize'}>
                            Created By
                        </td>
                        <td>
                            <UserProfileLink username={props.dataset.owner} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Created
                        </td>
                        <td>
                            {dayjs(props.dataset.created).fromNow()} ({dayjs(props.dataset.created).format('DD/MMM/YYYY') })
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Region
                        </td>
                        <td>
                            {regions.find((r) => r.value == props.dataset.region).label} / ({props.dataset.region})
                        </td>
                    </tr>

                </Table>
            </Col>
        </Row>
    );
};

export default General;
