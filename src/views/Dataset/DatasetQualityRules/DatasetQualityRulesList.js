import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import styled from "styled-components";
import {Container, Row, Col} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {If, Then , Else } from "react-if";
import useClient from "../../../api/client";
import listDatasetQualityRules from "../../../api/DatasetQualityRule/listDatasetQualityRules";
import MainActionButton from "../../../components/MainActionButton/MainButton";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Link,Route,Switch} from "react-router-dom";

let Styled= styled.div`
height: 100vh;
`

const DatasetQualityRulesList = (props)=>{
    let client = useClient();

    let [term, setTerm] = useState(``)
    let [rules, setRules]=useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    });

    const fetchItems= async ()=>{
        const response = await client.query(listDatasetQualityRules({
            datasetUri:props.dataset.datasetUri,
            filter:{
                page: rules.page,
                pageSize: 15
            }}));

        if (!response.errors){
            setRules(response.data.listDatasetQualityRules)
        }else {
            toast(`Could not retrieve rules, received ${response.errors[0].message}`);
        }
    }

    const columns=[
        {
            dataField: 'label',
            text: 'Name',
            headerStyle: {width: '5ch'},
            formatter : (cell, row)=>{
                return <Link to={`/dataset/${props.dataset.datasetUri}/dataset-quality-rule/${row.ruleUri}`}>
                    {cell}
                </Link>
            }
        },
        {
            dataField: 'description',
            headerStyle: {width: '5ch'},
            text: 'Description'
        }

    ]

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client]);

    return <Styled>
        <Container>
                    <Row>
                        <Col xs={8}>
                            <h4><Icon.GraphUp/> Data Quality Rules</h4>
                        </Col>
                        <Col xs={4}>
                            <Link to={`/dataset/${props.dataset.datasetUri}/new-data-quality-rule`}>
                                <MainActionButton>Create</MainActionButton>
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <If condition={rules.count}>
                            <Then>
                                <Col xs={12}>
                                    <Row>
                                        <Col xs={4}>
                                            Found {rules.count} rules
                                        </Col>
                                        <Col className={`pt-3 text-right`} xs={1}><Icon.ChevronLeft/></Col>
                                        <Col className={`pt-2 text-center`} xs={2}>Page {rules.page}/{rules.pages}</Col>
                                        <Col className={`pt-3 text-left`} xs={1}><Icon.ChevronRight/></Col>
                                    </Row>
                                </Col>
                                <Col className={`mt-1`} xs={12}>
                                    <BootstrapTable
                                        rowStyle={{height:'15px',fontSize:'13px'}}
                                        hover
                                        condensed
                                        bordered={ false }
                                        keyField='ruleUri'
                                        data={ rules.nodes}
                                        columns={ columns }
                                    />
                                </Col>
                            </Then>
                            <Else>
                                <Col xs={12}>
                                    <i>No rules found</i>
                                </Col>
                            </Else>
                        </If>
                    </Row>
        </Container>
    </Styled>
}


export default DatasetQualityRulesList;
