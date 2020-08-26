import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom";
import {If, Then,Else, Switch, Case,Default} from "react-if";
import styled from "styled-components";
import BootstrapTable from 'react-bootstrap-table-next';
import {toast} from "react-toastify";
import {Container, Row, Col,Modal,Button} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import listDatasetsPublishedInEnvironment from "../../api/Environment/listDatasetsPublishedInEnvironment";
import useClient from "../../api/client";
import dayjs from "dayjs"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)




const TableOverflow= styled.div`
height:60vh;
width:100%;
overflow-y:auto;
overflow-x: hidden;
scrollbar-color: lightblue white ;
scrollbar-width: thin;
padding-bottom: 22em;

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

const EnvironmentSharedDatasets = (props)=>{
    const env = props.environment;
    const client = useClient();

    const datasetLinkFormatter=(cell, row)=>{
        return <p>

            <Link target={`_blank`}  to={`/organization/${row.organizationUri}/dashboard`}>{row.organizationName}</Link> /
            <Link target={`_blank`}  to={`/dataset/${row.datasetUri}/overview`}>{row.datasetName}</Link>
        </p>
    }

    const typeFormatter= (cell, row)=>{
        return <Switch>
            <Case condition={row.itemType=="DatasetTable"}>
                <Icon.Table className={`pt-2`} size={22}/>
            </Case>
            <Case condition={row.itemType=="DatasetStorageLocation"}>
                <Icon.Folder  className={`pt-2`} size={22}/>
            </Case>
        </Switch>
    }

    const dateFormatter=(cell, row)=>{
        return <div>
            {dayjs(row.created).fromNow()}
        </div>
    }

    const envFormatter =(cell,row)=>{
        return <Link target={`_blank`} to={`/playground/${row.environmentUri}`}>{row.environmentName}({row.environmentUri})</Link>
    }
    const columns = [
        {
            dataField: 'itemType',
            formatter:typeFormatter,
            headerStyle: {width: '5ch'},
            text: 'Type'

        },
        {
            dataField:'environmentUri',
            text:'Shared By',
            //headerStyle: {width: '12ch'},
            formatter:envFormatter
        },
        {
            dataField: 'datasetName',
            //headerStyle: {width: '12ch'},
            text: 'Org/Dataset',
            formatter: datasetLinkFormatter
        },

        {
            dataField: 'GlueDatabaseName',
            //headerStyle: {width: '12ch'},
            text: 'Database'

        },
        {
            dataField: 'GlueTableName',
            text: 'Table Name'
        },
        {
            dataField: 'S3AccessPointName',
            text: 'S3 Access Point'
        },
        {
            dataField: 'created',
            text: 'Shared',
            formatter: dateFormatter
        },

    ];





    let [filterData, setFilterData] = useState({
        term : '',
        page:1,
        pageSize:5
    });

    let [items, setItems] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    })

    const listSharedItems=async ()=>{
        const response=await client.query(listDatasetsPublishedInEnvironment({environmentUri:env.environmentUri}));
        if (!response.errors){
            setItems(response.data.searchEnvironmentDataItems);
        }else {
            toast(`Could not retrieve Published datasets, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            listSharedItems()
        }
    },[client]);



    return <Container className={`mt-1`}>
        <Row>
            <Col xs={12}>
                <h4><Icon.FolderSymlink/>  Datasets Published in Environment <b className={`text-primary`}>{env.name} ({env.AwsAccountId}/{env.region})</b></h4>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={4}>
                <i>Found {items.count} data items</i>
            </Col>
            <Col xs={6}>
                <Row>
                    <Col className={` pt-2 text-right`} xs={1}><Icon.ChevronLeft size={16}/></Col>
                    <Col className={`text-center`}xs={3}>Page {items.page}/{items.pages}</Col>
                    <Col className={` pt-2  text-left`} xs={1}><Icon.ChevronRight size={16}/></Col>
                </Row>
            </Col>
            <Col  className={` pt-2`} xs={12}>
                <input style={{width:'100%'}} className={`form-control`}/>
            </Col>
        </Row>
        <Row className={`mt-3`}>
            <Col xs={12}>
                <If condition={items.count}>
                    <Then>
                        <TableOverflow>
                            <BootstrapTable
                                rowStyle={{height:'15px',fontSize:'13px'}}
                                hover
                                condensed
                                bordered={ false }
                                keyField='shareUri'
                                data={ items.nodes}
                                columns={ columns }
                            />

                        </TableOverflow>


                    </Then>
                    <Else>
                        <p>No items found.</p>
                    </Else>
                </If>
            </Col>
        </Row>

    </Container>
}


export default EnvironmentSharedDatasets;
