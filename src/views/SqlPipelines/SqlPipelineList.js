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

    let [term, setTerm] = useState();
    let [ready, setReady] = useState(false);

    const fetchItems= async()=>{
        const response = await client.query(
            listSqlPipelines ({term : term, page:sqlPipelines.page, pageSize:5})
        )
        if (!response.errors){
            setSqlPipelines(response.data.listSqlPipelines);
            setReady(true);
        }else {
            toast(`Received ${response.errors[0].message}`);
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])


    return <Styled>
        <Container className={""}>
            <Row>
                <Col xs={8}>
                    <h3> <Icon.ArrowRepeat/> My SQL Pipelines</h3>
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
                    <input
                        className={"form-control"}
                        name={'search'}
                        value={term}
                        onKeyDown={()=>{fetchItems()}}
                        onChange={(e)=>{setTerm(e.target.value)}} placeholder={"search your sqlPipelines"} style={{width:'100%'}}/>
                </Col>
                <Col xs={12}>
                    <Row>
                        <Col xs={7}>
                            <Row className={`mt-2`}>
                                <Col xs={4}><i>Found {sqlPipelines.count} results</i></Col>
                                <Col className={`pt-1 text-right`} xs={2}><Icon.ChevronLeft onClick={()=>{}}/></Col>
                                <Col className={` text-center`} xs={4}>Page {sqlPipelines.page}/{sqlPipelines.pages}</Col>
                                <Col className={`pt-1 text-left`} xs={2}><Icon.ChevronRight onClick={()=>{}}/></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

            </Row>

            <Row className={`mt-3`}>
                <If condition={ready}>
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
                        <Col xs={4}>
                            <Spinner variant={`primary`} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Else>
                </If>

            </Row>
        </Container>
    </Styled>

}


export default SqlPipelineList;
