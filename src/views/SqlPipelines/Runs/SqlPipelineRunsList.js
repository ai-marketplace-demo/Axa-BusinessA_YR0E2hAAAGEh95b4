import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge, Spinner} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import BootstrapTable from 'react-bootstrap-table-next';
import useClient from "../../../api/client";
import getSqlPipelineRuns from "../../../api/SqlPipeline/getSqlPipelineRuns";
import {toast} from "react-toastify";

const SqlPipelineRunList=(props)=>{

    const columns = [

        {
            dataField: 'JobName',
            //headerStyle: {width: '12ch'},
            text: 'JobName'

        },
        {
            dataField: 'StartedOn',
            text: 'StartedOn'
        },
        {
            dataField: 'CompletedOn',
            text: 'CompletedOn',
        },
        {
            dataField: 'JobRunState',
            text: 'JobRunState',
        }
    ];

    const client = useClient();
    const sqlPipeline = props.sqlPipeline;
    const [runs,setRuns] = useState(null);
    const [count, setCount] = useState(-1);
    const [ready,setReady] = useState(false);
    const fetchItems=async ()=>{
        const response = await client.query(getSqlPipelineRuns(sqlPipeline.sqlPipelineUri));
        console.log("SqlPipelineRunList.fetchItems",response)
        if (!response.errors){
            setRuns(response.data.getSqlPipeline.runs);
            setCount(response.data.getSqlPipeline.runs.length);
        }else {
            toast.warn(`Could not retrieved job runs, received ${response.errors[0].message}`);
        }
        setReady(true);
    }

    useEffect(()=>{
        if (client){
            fetchItems()
        }
    },[client])

    if (!ready){
        return <Container>
            <Row className={`mt-2 ml-2`}>
                <Col xs={12}>
                    <Spinner size={`sm`} variant={`primary`} animation={`border`}/>
                </Col>
            </Row>
        </Container>
    }

    return <Container>
        <Row>
            <Col xs={12}>
                <p> Found {count} job(s)</p>
            </Col>
        </Row>
        <Row>
            <Col className={`mt-3 mb-3`} xs={4}>
                <div className={`btn btn-primary rounded`}><Icon.Play/> Run Pipeline</div>
            </Col>
            <Col className={`mt-3 mb-3`}  xs={4}>

            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <BootstrapTable
                    rowStyle={{height:'15px',fontSize:'13px'}}
                    hover
                    condensed
                    bordered={ false }
                    keyField='shareUri'
                    data={ runs || []}
                    columns={ columns }
                />

            </Col>
        </Row>
    </Container>

}


export default SqlPipelineRunList;
