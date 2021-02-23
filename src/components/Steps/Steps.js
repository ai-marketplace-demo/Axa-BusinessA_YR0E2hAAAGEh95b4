import React, { useState, useEffect, cloneElement } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import styled from 'styled-components';


const withStep = (WrappedComponent, prev, next) => (props) => <WrappedComponent {...props} prevStep={prev} nextStep={next} />;

const Steps = (props) => {
    const [data, setData] = useState();
    const [current, setCurrent] = useState(0);
    const size = props.children.length;
    const next = () => {
        if (current + 1 <= size - 1) {
            setCurrent(current + 1);
        }
    };
    const previous = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Row>
                        {props.titles.map((title, index) => (
                            <div key={`step-${index}`}>{(index == current) ? (
                                <Col className={'text-primary pb-1'}><h4><b>{title}</b></h4></Col>
                            ) : (
                                <Col className={'text-dark pt-1'}><h5>{title}</h5></Col>
                            )}
                            </div>
                        ))}
                        <Col>{current}</Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            {cloneElement(props.children[current], { nextStep: next, prevStep: previous })}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};


export default Steps;
