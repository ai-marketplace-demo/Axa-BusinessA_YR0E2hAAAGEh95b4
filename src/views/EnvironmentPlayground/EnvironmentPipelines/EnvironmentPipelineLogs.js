import React, {useState, useEffect} from "react";
import {Row,Col, Container} from "react-bootstrap"
import {Link,useLocation} from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import {toast} from "react-toastify";
import {If,Then,Else,Switch, Case} from "react-if";
import styled from "styled-components";
import useClient from "../../../api/client";
import getPipelineLogs from "../../../api/Project/getPipelineLogs";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const Styled= styled.div`
height:60vh;
width:100%;
overflow-y:auto;
overflow-x: hidden;
scrollbar-color: lightblue white ;
scrollbar-width: thin;
  

&::-webkit-scrollbar
{
	width: 4px;
	padding-left: 1px;
	background-color: white;
}

&::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	background-color: lightblue;
}

`


const ProjectPipelineLogs= (props)=>{
    let client = useClient();
    let location = useLocation();
    let [ready, setReady] = useState(false);
    let pipeline =location.state.pipeline;
    let [logs, setLogs]=useState({
        count:1,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious: false,
        nodes:[]
    })


    const nextPage=()=>{
        if (logs.hasNext){
            setLogs({...logs, page:logs.page+1})
        }
    }

    const prevPage=()=>{
        if (logs.hasPrevious){
            setLogs({...logs, page:logs.page-1})
        }
    }


    const fetchItems=async ()=>{
        const response = await client.query(getPipelineLogs({
            filter:{
                page : logs.page,
                pageSize: logs.pageSize
            },
            pipelineUri: pipeline.pipelineUri
        }));

        if (!response.errors){
            toast(`Retrieved ${response.data.getPipeline.logs.count} executions`)
            setLogs({...response.data.getPipeline.logs})
        }else {
            toast(`Could not retrieve logs, received ${response.errors[0].message}`)
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, logs.page])
    return <Container>
        <Row>
            <Col xs={1}>
                <Link to={{
                    state:{pipeline,project:props.project},
                    pathname:`/project/${props.project.projectUri}/pipelines`}
                }
                >
                    <Icon.ChevronLeft color={`black`} size={24}/>
                </Link>

            </Col>
            <Col xs={9}>
                <h4><Icon.FileCode size={32}/> Execution of pipeline {pipeline.label}</h4>
            </Col>

        </Row>
        <Styled>
        <Row>
            <Col xs={4}>
                <p>Found {logs.count} executions(s)</p>
            </Col>
            <Col xs={8}>
                <Row>
                    <Col xs={3}><Icon.ChevronLeft onClick={prevPage}/></Col>
                    <Col className={`mb-3`} xs={3}>Page {logs.page}/{logs.pages}</Col>
                    <Col xs={3}><Icon.ChevronRight onClick={nextPage}/></Col>
                </Row>
            </Col>
            <Col xs={12}>
                <table className={`table table-sm`}>
                    <tr>
                        <th>
                            Arn
                        </th>
                        <th>
                            Started
                        </th>
                        <th>
                            Last Update
                        </th>
                        <th>
                            Status
                        </th>
                    </tr>
                    <If condition={logs.count}>
                        <Then>
                            {
                                logs.nodes.map((log)=>{
                                    return <tr>
                                        <td>
                                            {log.executionUri}
                                        </td>
                                        <td>
                                            {dayjs(log.created).fromNow()}
                                        </td>
                                        <td>
                                            {dayjs(log.updated).fromNow()}
                                        </td>
                                        <td>
                                            {log.status}
                                        </td>
                                    </tr>
                                })
                            }
                        </Then>
                        <Else>
                            <p><i>No Executions </i></p>
                        </Else>
                    </If>
                </table>
            </Col>
        </Row>
        </Styled>
    </Container>
}

export default ProjectPipelineLogs;
