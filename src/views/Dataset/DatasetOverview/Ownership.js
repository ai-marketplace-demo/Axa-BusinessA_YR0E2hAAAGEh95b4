import React, { useState } from 'react';
import { If, Then, Else } from 'react-if';
import {
    Container, Row, Col, Table
} from 'react-bootstrap';
import dayjs from 'dayjs';
import EasyEdit, { Types } from 'react-easy-edit';
import Creatable from 'react-select/creatable/dist/react-select.esm';
import UserProfileLink from '../../Profile/UserProfileLink';


const Ownership = (props) => {
    const { canEdit } = props;
    return (
        <Row className={'mt-2'}>
            <Col xs={12}>
                <Table hover size="sm">
                    <tbody>
                        <tr>
                            <td className={'text-capitalize'}>
                                Business Owner
                            </td>
                            <td>
                                <If condition={props.canEdit}>
                                    <Then>
                                        <EasyEdit
                                            attributes={{ name: 'businessOwnerEmail' }}
                                            type={Types.TEXT}
                                            onSave={props.handleEdit('businessOwnerEmail')}
                                            value={props.dataset.businessOwnerEmail}
                                        >
                                        </EasyEdit>

                                    </Then>
                                    <Else>
                                        <p>{props.dataset.businessOwnerEmail}</p>
                                    </Else>
                                </If>

                            </td>
                        </tr>
                        <tr scope="row">
                            <td className={'text-capitalize'}>
                                Stewards
                            </td>
                            <td>
                                <If condition={props.canEdit}>
                                    <Then>
                                        <Creatable
                                            isMulti
                                            onChange={props.selectStewardEmails}
                                            // options={[]}
                                            value={props.businessOwnerDelegationEmails || []}
                                        />
                                    </Then>
                                    <Else>
                                        <p>{props.selectStewardEmails.toString()}</p>
                                        {props.dataset.businessOwnerDelegationEmails.map((t) => <div>{t}</div>)}
                                    </Else>
                                </If>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Organization
                            </td>
                            <td>
                                {props.dataset.organization.label}({props.dataset.organization.organizationUri})
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Environment
                            </td>
                            <td>
                                {props.dataset.environment.label}({props.dataset.environment.environmentUri})
                            </td>
                        </tr>
                    </tbody>

                </Table>
            </Col>
        </Row>
    );
};

export default Ownership;
