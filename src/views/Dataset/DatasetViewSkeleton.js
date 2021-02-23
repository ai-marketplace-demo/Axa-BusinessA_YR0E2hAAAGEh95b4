import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ReactPlaceholder from 'react-placeholder';


const DatasetViewSkeleton = (props) => (
    <Container>

        <Row className={'mt-3    '}>
            <Col xs={1}>
                <ReactPlaceholder style={{ width: 50, height: 50 }} showLoadingAnimation type="round" ready={false} color="#E0E0E0" />
            </Col>
            <Col xs={6}>
                <ReactPlaceholder showLoadingAnimation type="text" ready={false} rows={3} color="#E0E0E0">

                </ReactPlaceholder>
            </Col>
            <Col xs={4}>
                <ReactPlaceholder showLoadingAnimation type="text" ready={false} rows={2} color="#E0E0E0">

                </ReactPlaceholder>
            </Col>
        </Row>
        <Row className={'mt-3    '}>
            <Col xs={12}>
                <ReactPlaceholder showLoadingAnimation type="text" ready={false} rows={1} color="#E0E0E0" />
            </Col>
            <Col xs={12}>
                <ReactPlaceholder showLoadingAnimation type="text" ready={false} rows={4} color="#E0E0E0" />
            </Col>
        </Row>

    </Container>
);


export default DatasetViewSkeleton;
