import React from "react";
import {Container, Row,Col} from "react-bootstrap";
import styled from "styled-components";
import { ArcherContainer, ArcherElement } from 'react-archer';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import Loader from 'react-loaders'
require('loaders.css/loaders.css');

const Front = styled.div`
 position: absolute;
  left: 0px;
  top: 0px;
  z-index: 2;
`

const Graph = (props)=>{
    const rootStyle = { display: 'flex', justifyContent: 'center' };
    const rowStyle = { margin: '200px 0', display: 'flex', justifyContent: 'space-between', }
    const boxStyle = { padding: '10px', border: '1px solid black', };
    return <Container fluid>
        <div>

            <ArcherContainer strokeColor='red' >
                <div style={rootStyle}>
                    <ArcherElement
                        id="root"
                        relations={[{
                            targetId: 'element2',
                            targetAnchor: 'top',
                            sourceAnchor: 'bottom',
                        }]}
                    >
                        <div style={boxStyle}>Root</div>
                    </ArcherElement>
                </div>

                <div style={rowStyle}>
                    <ArcherElement
                        id="element2"
                        relations={[{
                            targetId: 'element3',
                            targetAnchor: 'left',
                            sourceAnchor: 'right',
                            style: { strokeColor: 'blue', strokeWidth: 1 },
                            label: <div style={{ marginTop: '-20px' }}>Arrow 2</div>,
                        }]}
                    >
                        <div style={boxStyle}>Element 2</div>
                    </ArcherElement>

                    <ArcherElement id="element3">
                        <div style={boxStyle}>Element 3</div>
                    </ArcherElement>

                    <ArcherElement
                        id="element4"
                        relations={[{
                            targetId: 'root',
                            targetAnchor: 'right',
                            sourceAnchor: 'left',
                            label: 'Arrow 3',
                        }]}
                    >
                        <div style={boxStyle}>Element 4</div>
                    </ArcherElement>
                </div>
            </ArcherContainer>

        </div>
    </Container>
}



const DatasetViewSkeleton = (props)=>{
    return <Container>

        <Row className={"mt-3    "}>
            <Col xs={1}>
                <ReactPlaceholder  style={{ width: 50, height: 50 }} showLoadingAnimation={true} type='round' ready={false} color='#E0E0E0'/>
            </Col>
            <Col xs={6}>
                <ReactPlaceholder showLoadingAnimation type='text' ready={false} rows={3} color='#E0E0E0'>

                </ReactPlaceholder>
            </Col>
            <Col xs={4}>
                <ReactPlaceholder showLoadingAnimation type='text' ready={false} rows={2} color='#E0E0E0'>

                </ReactPlaceholder>
            </Col>
        </Row>
        <Row className={"mt-3    "}>
            <Col xs={12}>
                <ReactPlaceholder showLoadingAnimation type='text' ready={false} rows={1} color='#E0E0E0'/>
            </Col>
            <Col xs={12}>
                <ReactPlaceholder showLoadingAnimation type='text' ready={false} rows={4} color='#E0E0E0'/>
            </Col>
        </Row>

    </Container>
}

const L = (props)=>{
    return <Container className={`bg-transparent`}>
        <Row>
            <Col xs={12}>
                <h1>loader</h1>
            </Col>
            <Col xs={12}>
                <Loader color={`lightblue`} type="ball-scale-multiple" />
            </Col>
        </Row>
    </Container>
}


export default L;
