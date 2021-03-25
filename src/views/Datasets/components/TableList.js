import React from 'react';
import {Button, Header, Icon, Message} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import listDatasetTables from "../../../api/Dataset/listDatasetTables";
import useClient from "../../../api/client";
import {useEffect, useState} from "react";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import syncTables from "../../../api/Dataset/syncTables";
import crawlDataset from "../../../api/Dataset/crawlDataset";

const TableList = ({dataset, tables, setTables}) => {
    const client = useClient();
    const [items, setItems] = useState(tables ? tables : PagedResponseDefault);
    const [loading, setLoading] = useState(true);
    const [startingCrawler, setStartingCrawler] = useState(false);
    const [message, setMessage] = useState(null);
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
        else{
            setMessage({
                negative: true,
                positive: false,
                header: 'Sync Error',
                content: `Failed to synchronize tables from Glue catalog. ${response.errors[0].message}`
            })
        }
        setLoading(false);
    }

    const startCrawlingDataset = async()=>{
        setStartingCrawler(true)
        const response = await client.mutate(crawlDataset(dataset.datasetUri));
        if (!response.errors){
            setMessage({
                negative: false,
                positive: true,
                content: 'Crawler Started',
            })
        }
        else{
            setMessage({
                negative: true,
                positive: false,
                header: 'Crawler Error',
                content: `Failed to crawl dataset. ${response.errors[0].message}`
            })
        }
        setStartingCrawler(false)
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
        {message && <Message positive={message.positive} negative={message.negative} onDismiss={() => setMessage(null)}>
            <Message.Header>{message.header}</Message.Header>
            <Message.Content>
                <p>{message.content}</p>
            </Message.Content>
        </Message>
        }
        <div>
            <Button loading={loading} onClick={synchronizeTables}  size={'mini'} content='Sync Tables' icon='sync alternate' labelPosition='left'/>
            <Button loading={startingCrawler} onClick={startCrawlingDataset}  size={'mini'} content='Crawl Dataset' icon='bug icon' labelPosition='left'/>
        </div>
        <TableContainer
        loading={loading}
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
