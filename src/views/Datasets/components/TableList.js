import React from 'react';
import {Button, Header, Icon, Message} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import listDatasetTables from "../../../api/Dataset/listDatasetTables";
import useClient from "../../../api/client";
import {useEffect, useState} from "react";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import syncTables from "../../../api/Dataset/syncTables";

const TableList = ({dataset, tables, setTables}) => {
    const client = useClient();
    const [items, setItems] = useState(tables ? tables : PagedResponseDefault);
    const [loading, setLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const [filter, setFilter] = useState({
        term : '',
        page:1,
        pageSize:15
    });

    const synchronizeTables= async()=>{
        setLoading(true);
        const response = await client.mutate(syncTables(dataset.datasetUri));
        if (!response.errors){
            setItems(response.data.syncTables)
        }
        setLoading(false);
    }

    const fetchItems = async () => {
        setLoading(true)
        const response = await client.query(listDatasetTables({datasetUri: dataset.datasetUri}));
        if (!response.errors) {
            setItems({...response.data.getDataset.tables});
            setTables && setTables({...response.data.getDataset.tables});
        }
        setLoading(false);
    }


    useEffect(() => {
        if (client) {
            if (!tables) {
                fetchItems();
            }
        }
    }, [client])
    return<div>
        {showInfo && <Message onDismiss={() => setShowInfo(false)}>
            <Message.Content>
                <p>Create tables from  <Link style={{color:'#1890ff'}} to={`/worksheets`}>
                Worksheets </Link> using SQL queries or
                    upload a file.</p>
            </Message.Content>
        </Message>
        }<TableContainer
        loading={loading}
        reload={synchronizeTables}
        filter={{
            filter:filter,setFilter:setFilter
        }}
        columns={[
            {label: "Name", key: "label"},
            {label: "Database", key: 'GlueDatabaseName'},
            {label: 'Description', key: "description"},
            {label: 'Created', key: "created"},
            {label: 'Explore', key: "explore"},
        ]}
        rows={
            items.nodes.map((table) => {
                return {
                    ...table,
                    explore: <Link to={`/table/${table.tableUri}/`}><Button size={`tiny`}>Explore</Button></Link>,
                    label: (<Header as='h4' image>
                        <Header.Content>
                            <Header.Subheader>
                                <Link to={`/table/${table.tableUri}/`}>{table.GlueTableName}</Link>
                            </Header.Subheader>
                        </Header.Content>
                    </Header>)
                }
            })
        }
    /></div>
}

export default TableList;
