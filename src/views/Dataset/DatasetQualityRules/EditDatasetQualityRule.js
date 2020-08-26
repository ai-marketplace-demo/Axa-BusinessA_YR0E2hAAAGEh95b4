import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import styled from "styled-components";
import {Container, Row, Col} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {If, Then , Else } from "react-if";
import useClient from "../../../api/client";
import updateDatasetQualityRule  from "../../../api/DatasetQualityRule/updateDatasetQualityRule";
import getDatasetQualityRule  from "../../../api/DatasetQualityRule/getDatasetQualityRule";
import MainActionButton from "../../../components/MainActionButton/MainButton";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Link,useHistory,useParams} from "react-router-dom";

let Styled= styled.div`
height: 100vh;
`

const DatasetQualityRuleEditor = (props)=>{
    let client = useClient();
    let history = useHistory();
    let params=useParams()
    let ruleUri= params.ruleUri;

    let [formData, setFormData] = useState({
        label:'',
        description:'',
        query:''
    });

    const fetchRule = async()=>{
        const response=await client.query(getDatasetQualityRule(ruleUri));
        if (!response.errors){
            setFormData(response.data.getDatasetQualityRule)
        }else {
            toast(`Could not retrieve rule , received ${response.errors[0].message}`)
        }

    }



    const updateRule=async ()=>{
        const response = await client.mutate(updateDatasetQualityRule({
            ruleUri:ruleUri,
            input: {
                query : formData.query,
                description : formData.description,
                label : formData.label
            }
        }))
        if (!response.errors){
            toast(`Created new rule ${response.data.createDatasetQualityRule.ruleUri}`);
            history.goBack();
        }else{
            toast(`Could not create data quality rule, received ${response.errors[0].message}`);
        }
    }

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]: e.target.value})
    }

    useEffect(()=>{
        if (client){
            fetchRule();
        }
    },[client]);

    return <Styled>
        <Container>
            <Row>
                <Col xs={1}>
                    <Link style={{color:`black`}} to={`/dataset/${props.dataset.datasetUri}/data-quality-rules`}>
                        <Icon.ChevronLeft className={`pt-2`} size={32}/>
                    </Link>
                </Col>
                <Col xs={8}>
                    <h4>Edit rule {formData.label}</h4>
                </Col>
            </Row>
            <Row className={`mt-2 `}>
                <Col xs={2}><b>Name</b></Col>
                <Col xs={9}>
                    <input name={`label`} className={`form-control`} value={formData.label} onChange={handleChange}/>
                </Col>
            </Row>
            <Row className={`pt-2`} >
                <Col xs={2}><b>Description</b></Col>
                <Col xs={9}>
                    <input name={`description`} className={`form-control`} value={formData.description} onChange={handleChange}/>
                </Col>

            </Row>
            <Row className={`pt-2`} >
                <Col xs={2}><b>Query</b></Col>
                <Col xs={9}>
                    <textarea style={{fontFamily:'Courier' ,overflowY:'auto'}} rows={10} name={`query`} className={`bg-dark text-white form-control`} value={formData.query} onChange={handleChange}/>
                </Col>

            </Row>
            <Row className={`mt-3`}>
                <Col xs={2}></Col>
                <Col xs={4}>
                    <div onClick={updateRule} className={`btn btn-sm btn-primary`}>
                        Save
                    </div>
                </Col>

            </Row>

        </Container>
    </Styled>
}


export default DatasetQualityRuleEditor;
