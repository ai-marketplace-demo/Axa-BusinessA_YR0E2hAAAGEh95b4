import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge, Spinner} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import useClient from "../../../api/client";
import getSqlPipelineBuilds from "../../../api/SqlPipeline/getSqlPipelineBuilds";
import {toast} from "react-toastify";

const SqlPipelineBuildList=(props)=>{

    const columns = [

        {
            dataField: 'pipelineExecutionId',
            //headerStyle: {width: '12ch'},
            text: 'pipelineExecutionId'

        },
        {
            dataField: 'status',
            text: 'status'
        },
        {
            dataField: 'startTime',
            text: 'startTime',
        },
        {
            dataField: 'lastUpdateTime',
            text: 'lastUpdateTime',
        }
    ];

    const client = useClient();
    const sqlPipeline = props.sqlPipeline;
    const [builds,setBuilds] = useState(null);
    const [count, setCount] = useState(-1);
    const [ready,setReady] = useState(false);
    const fetchItems=async ()=>{
        const response = await client.query(getSqlPipelineBuilds(sqlPipeline.sqlPipelineUri));
        console.log("getSqlPipelineBuilds.fetchItems",response)
        if (!response.errors){
            setBuilds(response.data.getSqlPipeline.builds);
            setCount(response.data.getSqlPipeline.builds.length);
        }else {
            toast.warn(`Could not retrieved builds list, received ${response.errors[0].message}`);
        }
        setReady(true)
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])


    if (!ready){
        return <Container>
            <Row className={`mt-2 ml-2`}>
                <Col xs={12}>
                    <Spinner variant={`primary`} animation={`border`}/>
                </Col>
            </Row>
        </Container>
    }
    return <Container>
        <Row>
            <Col xs={12}>
                <p> Found {count} build(s)</p>
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
                    data={ builds || []}
                    columns={ columns }
                />

            </Col>
        </Row>
    </Container>

}


export default SqlPipelineBuildList;
