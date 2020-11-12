import React, {useState, useEffect} from "react";
import {Container, Row, Col, Badge, Spinner} from "react-bootstrap";
import {If,Then, Else, Switch, Case, Default} from "react-if";
import BootstrapTable from 'react-bootstrap-table-next';
import useClient from "../../../api/client";
import getSqlPipelineBuilds from "../../../api/SqlPipeline/getSqlPipelineBuilds";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const SqlPipelineBuildList=(props)=>{
    const dateFormatter= (cell, row, rowIndex)=>{
        return <div>{dayjs(cell).fromNow()}</div>
    }


    const statusRenderer= (cell, row, rowIndex)=>{
        return <h6><Switch>
            <Case condition={cell=="Succeeded"}>
                <Badge variant={`success`}>{cell}</Badge>
            </Case>
            <Case condition={cell=="Failed"}>
                <Badge variant={`warning`}>{cell}</Badge>
            </Case>
            <Case condition={cell=="InProgress"}>
                <div>  <Badge variant={`primary`}>{cell}</Badge> <Spinner size={`sm`} animation={`border`} variant={`primary`}/></div>
            </Case>
            <Default>
                <Badge variant={`danger`}>{cell}</Badge>
            </Default>
        </Switch>
        </h6>
    }

    const columns = [

        {
            dataField: 'pipelineExecutionId',
            //headerStyle: {width: '12ch'},
            text: 'Execution Id',
            formatter: (cell)=>{
                return <small><code>{cell}</code></small>
            }

        },
        {
            dataField: 'status',
            text: 'Status',
            formatter : statusRenderer,
        },
        {
            dataField: 'startTime',
            text: 'Started',
            formatter: dateFormatter
        },
        {
            dataField: 'lastUpdateTime',
            text: 'Last Update',
            formatter: dateFormatter
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
