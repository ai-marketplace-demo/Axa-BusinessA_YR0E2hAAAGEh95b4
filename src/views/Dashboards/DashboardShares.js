import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import Select from 'react-select';


const DashboardShares = (props) => {
    const [shareForm, setShareForm] = useState(false);
    const [group, setGroup] = useState(null);
    const [environments, setEnvironments] = useState({
        count: 0,
        page: 1,
        pages: 1,
        hasNext: false,
        hasPrevious: false,
        nodes: [

        ]
    });

    return (
        <Container fluid>
            <If condition={shareForm}>
                <Then>
                    <Row className={'mt-3'}>
                        <Col xs={10} />
                        <Col xs={2}>
                            <div onClick={() => { setShareForm(false); }} className={'btn btn-sm rounded-pill btn-secondary'}>
                                Cancel
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>Group</Col>
                        <Col xs={12}>
                            <input
                                className={'form-control rounded-pill'}
                                onChange={(e) => { setGroup(e.target.value); }}
                                value={group}
                            />
                        </Col>
                    </Row>


                </Then>
                <Else>
                    <Row className={'mt-3'}>
                        <Col xs={10} />
                        <Col xs={2}>
                            <div onClick={() => { setShareForm(true); }} className={'btn btn-sm btn-primary rounded-pill'}>
                                Share
                            </div>
                        </Col>
                    </Row>
                    <Row className={'mt-2'}>
                        <Col xs={12}>
                            <table className="table table-lg">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Environment</th>
                                        <th scope="col">Group</th>
                                        <th scope="col">Created</th>
                                        <th scope="col">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Corp(Finance) 11111111111</td>
                                        <td>Finance Team</td>
                                        <td>three days ago</td>
                                        <td><div className={'btn-sm btn btn-danger'}>Remove </div> </td>
                                    </tr>

                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Else>
            </If>


        </Container>
    );
};


export default DashboardShares;
