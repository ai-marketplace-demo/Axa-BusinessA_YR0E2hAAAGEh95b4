import React, { useState } from 'react';
import { If, Then, Else } from 'react-if';
import { Container, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';


const Pager = (props) => {
    const defaultCallback = () => {};
    return (
        <React.Fragment>
            <Row className={'mt-3'}>
                <Col xs={4}>
                    <If condition={props.count || 0 > 0}>
                        <Then>
                            <i>Found {props.count || 0} {props.label || 'items'}</i>
                        </Then>
                        <Else>
                            <i>No {props.label || 'items'} found</i>
                        </Else>
                    </If>

                </Col>
                <Col xs={2} />
                <Col xs={4}>
                    <Row>
                        <Col onClick={props.previous} className={'text-right pt-1'} xs={4}><Icon.ChevronLeft /></Col>
                        <Col className={'text-center pb-1'} xs={4}>Page {props.page.toString()}/{props.pages.toString()}</Col>
                        <Col onClick={props.next} className={'text-left pt-1'} xs={4}><Icon.ChevronRight /></Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'mt-1'}>
                <Col xs={12}>
                    <input

                        onKeyDown={props.onKeyDown || defaultCallback}
                        onChange={props.onChange || defaultCallback}
                        className={'rounded-pill form-control'}
                        name={'search'}
                        style={{ width: '100%' }}
                        placeholder={props.placeholder || 'search'}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};


export default Pager;
