import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Spinner, Badge, Table
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import Editor from '@monaco-editor/react';
import {
    If, Then, Else, Case, Switch, Default
} from 'react-if';
import Select from 'react-select';
import styled from 'styled-components';
import { HotTable } from '@handsontable/react';
import useClient from '../../api/client';

const TableStyled = styled.div`

`;


const ResultTable = (props) => {
    const data = [
        ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
        ['2016', 10, 11, 12, 13],
        ['2017', 20, 11, 14, 13],
        ['2018', 30, 15, 12, 13]
    ];
    return (
        <div style={{ backgroundColor: '' }}>
            <HotTable
                data={data}
                colHeaders
                key={'non-commercial-and-evaluation'}
                rowHeaders
                stretchH={'last'}
                width={'100%'}
                height={'300'}
            />
        </div>
    );


    return (
        <table className={'table table-sm'}>
            <thead style={{ backgroundColor: '' }}>
                <tr>
                    {
                        '1234567'.split('').map((i) => (
                            <td style={{ borderRight: '1px solid grey' }} className={'text-center'}>
                                col{i}
                            </td>
                        ))
                    }
                </tr>
            </thead>
        </table>
    );
};

const QueryTool = (props) => (
    <Container className={'mt-4'} fluid>
        <Row>
            <Col xs={12}>
                <h3><Icon.Terminal /> My Queries</h3>
            </Col>
        </Row>
        <Row>
            <Col xs={9}>
                <Row className={'mt-2'}>
                    <Col xs={12}>
                        <Editor
                            value={'select * from mytable'}
                            options={{ minimap: { enabled: false } }}
                            // theme={"hc-black"}
                            inDiffEditor={false}
                            height="19rem"
                            language="sql"
                        />
                    </Col>
                </Row>
                <Row className={'mt-2'}>
                    <Col xs={4}>
                        <Select />
                    </Col>
                    <Col xs={2}>
                        <div className={'btn btn-secondary btn-sm rounded-pill'}>Run</div>
                    </Col>
                    <Col xs={2}>
                        <div className={'btn btn-primary btn-sm rounded-pill'}>Save</div>
                    </Col>
                    <Col xs={2}>
                        <div className={'btn btn-success btn-sm rounded-pill'}>Save</div>
                    </Col>
                </Row>
                <Row>
                    <Col className={'mt-2'} fluid xs={12}>
                        <ResultTable />
                    </Col>
                </Row>

            </Col>
            <Col className={' border-left'} xs={3}>
                <Row>
                    <Col xs={12}>
                        <input className={'form-control border-bottom '} />
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
);


export default QueryTool;
