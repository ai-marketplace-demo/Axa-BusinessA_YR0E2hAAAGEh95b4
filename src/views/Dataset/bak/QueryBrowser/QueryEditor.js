import React ,{useState} from "react";
import {Row, Col, Container} from "react-bootstrap";
import Editor from '@monaco-editor/react';
import styled from "styled-components";



const QueryEditor = (props)=>{
    return <>
        <Row>
            <Col xs={12}>
                <h4>{props.fileName||"Untitled"}</h4>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <p>{props.description||"No Description"}</p>
            </Col>
        </Row>
        <Row className={"pt-4"}>
            <Col xs={12}>
                <Editor options={{minimap:{enabled:false}}} theme={"vs-dark"} inDiffEditor={false} height="9rem" language="sql" />;
            </Col>
        </Row>
    </>
}



export default QueryEditor;
