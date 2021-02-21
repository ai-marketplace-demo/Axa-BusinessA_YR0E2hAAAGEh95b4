import useClient from "../../../api/client";
import React, {useEffect, useState} from "react";
import {If, Then, Else} from "react-if";
import listDatasetTableColumns from "../../../api/DatasetTable/listDatasetTableColumns";
import syncDatasetTableColumns from "../../../api/DatasetTable/syncDatasetTableColumns";
import {toast} from "react-toastify";
import {Container,Col, Row, Spinner,Table} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const DatasetTableColumns =(props)=>{
    const client= useClient();
    const [ready,setReady] = useState(false);
    const [filter, setFilter] = useState({page:1, pageSize:65,term:""});
    const [refreshingColumns,setRefreshingColumns]= useState(false);
    const [columns, setColumns]= useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious: false,
        nodes:[]

    })
    const fetchItems = async()=>{
        setReady(false);
        const response = await client.query(listDatasetTableColumns({tableUri:props.table.tableUri,filter:filter}))
        if (!response.errors){
            setColumns(response.data.listDatasetTableColumns);
        }else {
            toast(`Could not retroieve columns, received ${response.errors[0].message}`);
        }
        setReady(true);
    }


    const startSyncColumns=async ()=>{
        setRefreshingColumns(true);
        const response = await client.mutate(syncDatasetTableColumns(props.table.tableUri));
        if (!response.errors){
            setColumns(response.data.syncDatasetTableColumns)
        }else {
            toast(`Could not sync columns, received ${response.errors[0].message}`);
        }
        setRefreshingColumns(false);

    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, props.table]);


    if (!ready){
        return <Row>
            <Col xs={12}>
                <Spinner variant={`primary`} animation={`border`} size={`sm`}/>
            </Col>
        </Row>
    }


    return <Container fluid>
        <Row>
            <Col xs={10}/>
            <Col xs={1}>
                <If condition={refreshingColumns}>
                    <Then>
                        <Spinner size={`sm`} variant={`secondary`} animation={`border`}/>
                    </Then>
                    <Else>
                        <div/>
                    </Else>
                </If>
            </Col>
            <Col xs={1}>
                <If condition={!refreshingColumns}>
                    <Then>
                        <div onClick={startSyncColumns} className={`btn btn-sm rounded-pill btn-secondary`}>
                            <Icon.ArrowClockwise/>
                        </div>
                    </Then>
                </If>

            </Col>
        </Row>
        <Row className={`mt-3`}>
        <Col xs={12}>
            <Table borderless hover  size="sm">
            <thead>
            <tr className={`text-capitalize`}>
                <th >COLUMN NAME</th>
                <th >TYPE</th>
                <th>DESCRIPTION</th>
            </tr>

            </thead>
            <tbody>
            {
                columns.nodes.map((c)=>{
                    return <tr>
                        <td><b>{c.name}</b></td>
                        <td><code>{c.typeName}</code></td>
                        <td>{c.description}</td>
                    </tr>

                })
            }
            </tbody>
        </Table>
        </Col>
    </Row>
    </Container>
}


export default DatasetTableColumns
