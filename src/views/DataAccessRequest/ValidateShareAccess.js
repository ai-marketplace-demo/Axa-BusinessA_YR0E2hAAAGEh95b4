import React, {useState, useEffect} from "react";
import {Row, Col, Container, Spinner} from "react-bootstrap";
import useClient from "../../api/client";
import getShareAccessRequestFromLink from "../../api/DataAccessRequest/getShareAccessRequestFromLink";


const ValidateShareObject = (props)=>{

    return <Container>
        <Row>
            <Col xs={12}>
                <h3>Validate Dataset Access Request</h3>
            </Col>
        </Row>
    </Container>
}


export default ValidateShareObject;
