import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Spinner} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import MainActionButton from "../../components/MainActionButton/MainButton";
import {Link} from "react-router-dom";
import useClient from "../../api/client";
import listSqlPipelines from "../../api/SqlPipeline/listSqlPipelines";
import {toast} from "react-toastify";
import SqlPipelineListItem from "./SqlPipelineListItem";

const Styled=styled.div`
height:100vh;
`


const SqlPipelineList = function(){
    const client = useClient();

    const [sqlPipelines,setSqlPipelines] =useState({
        count:  0,
        page : 1,
        pages:1,
        hasNext:false,
        hasPrevious : false,
        nodes:[]
    })

    const fetchItems= async()=>{
        const response = await client.query(
            listSqlPipelines ({})
        )
        if (!response.errors){
            toast(`Retrieved ${response.data.listSqlPipelines.count} sqlPipelines`);
            setSqlPipelines(response.data.listSqlPipelines);
        }else {
            toast(`Received ${response.errors[0].message}`);
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,sqlPipelines.page])
    return <Styled>
        <Container className={""}>
            <Row>
                <Col xs={3}>
                    <h3> <Icon.ArrowRepeat/> My SQL Pipelines</h3>
                </Col>
                <Col xs={7}>
                    <Row className={`mt-2`}>
                        <Col xs={4}><i>Found {sqlPipelines.count} results</i></Col>
                        <Col className={`pt-1 text-right`} xs={2}><Icon.ChevronLeft onClick={()=>{}}/></Col>
                        <Col className={` text-center`} xs={4}>Page {sqlPipelines.page}/{sqlPipelines.pages}</Col>
                        <Col className={`pt-1 text-left`} xs={2}><Icon.ChevronRight onClick={()=>{}}/></Col>
                    </Row>
                </Col>
                <Col xs={1} className={`mt-2`}>
                    <MainActionButton>
                        <Link to={"/newsqlPipeline"}>
                            Create
                        </Link>
                    </MainActionButton>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col xs={12}>
                    <input className={"form-control"} name={'search'} value={''} onKeyDown={()=>{}} onChange={()=>{}} placeholder={"search your sqlPipelines"} style={{width:'100%'}}/>
                </Col>

            </Row>

            <Row className={`mt-3`}>
                <If condition={sqlPipelines.count}>
                    <Then>
                        {
                            sqlPipelines.nodes.map((sqlPipeline)=>{
                                return <Col xs={4}>
                                    <SqlPipelineListItem sqlPipeline={sqlPipeline}/>
                                </Col>
                            })
                        }
                    </Then>
                    <Else>
                        <div></div>
                    </Else>

                </If>

            </Row>
        </Container>
    </Styled>

}


export default SqlPipelineList;
