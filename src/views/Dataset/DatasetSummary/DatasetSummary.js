import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge} from "react-bootstrap"
import {If, Then, Else, Switch, Case} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {Link, useLocation, userParams} from "react-router-dom";
import styled from "styled-components";
import {toast} from "react-toastify";
import SimpleMDE from "react-simplemde-editor";
import ReactMarkdown from 'react-markdown';
import useClient from "../../../api/client";
import getDatasetSummary from "../../../api/Dataset/getDatasetSummary";
import saveDatasetSummary from "../../../api/Dataset/saveDatasetSummary";
import "easymde/dist/easymde.min.css";





const EditorStyled=styled.div`
height:100vh;
`

const DatasetSummary = (props)=>{
    let client =useClient();
    let [isEditorMode, setIsEditorMode] = useState(false);
    let [content, setContent] = useState("");


    let canEdit = ['BusinessOwner','Admin','DataSteward','Creator'].indexOf(props.dataset.userRoleForDataset)==-1?false:true

    const handleChange=(value)=>{
        setContent(value);
    }
    const fetchSummary = async ()=>{
        const response= await client.query(getDatasetSummary(props.dataset.datasetUri));
        if (!response.errors){
            setContent(response.data.getDatasetSummary);
        }else {
            toast(`Could not retrieve dataset summary, received ${response.errors[0].message}`)
            setContent(response.errors[0].message)
        }
    }

    const saveSummary= async()=>{
        const response = await client.mutate(saveDatasetSummary({datasetUri:props.dataset.datasetUri, content:content}))
        if (!response.errors){
            toast(`Saved summary`)
        }else {
            toast(`Could not retrieve dataset summary, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchSummary();
        }
    },[client])

    return <EditorStyled>
        <Container>
        <Row>
            <Col xs={8}>
                <h4> <Icon.Book size={32}/> Summary of <b className={`text-primary`}> {props.dataset.label} </b></h4>
            </Col>
            <Col xs={2}>
                <If condition={isEditorMode}>
                    <Then>
                        <div className={"btn-group"}>
                            <div className={`btn-sm btn btn-secondary`} onClick={()=>{setIsEditorMode(false)}}>Close</div>
                            <div className={`btn-sm btn btn-primary`} onClick={saveSummary}>Save</div>

                        </div>
                    </Then>
                    <Else>
                        <If condition={canEdit}>
                            <Then>
                                <div onClick={()=>{setIsEditorMode(true)}}>Edit</div>
                            </Then>
                        </If>
                    </Else>
                </If>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <If condition={isEditorMode}>
                    <Then>
                        <EditorStyled>
                            <SimpleMDE
                                value={content}
                                onChange={handleChange}
                            />
                        </EditorStyled>
                    </Then>
                    <Else>
                        <ReactMarkdown source={content} />
                    </Else>
                </If>
            </Col>
        </Row>

    </Container>
    </EditorStyled>
}



export default DatasetSummary;
