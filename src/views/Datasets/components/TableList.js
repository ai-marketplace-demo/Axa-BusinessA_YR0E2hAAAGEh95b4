import React from 'react';
import {Button, Divider, Header, Icon, Message, Modal} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import listDatasetTables from "../../../api/Dataset/listDatasetTables";
import useClient from "../../../api/client";
import {useEffect, useState} from "react";
import syncTables from "../../../api/Dataset/syncTables";
import crawlDataset from "../../../api/Dataset/crawlDataset";
import * as ReactIf from "react-if";
import * as Defaults from "../../../components/defaults";

const TableList = ({dataset, tables, setTables}) => {
    const client = useClient();
    const [loading, setLoading] = useState(true);
    const [startingCrawler, setStartingCrawler] = useState(false);
    const [syncingTables, setSyncingTables] = useState(false);
    const [message, setMessage] = useState(null);
    const [showCrawlerRuns, setShowCrawlerRuns] = useState(false);
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);

    const synchronizeTables= async()=>{
        setSyncingTables(true);
        const response = await client.mutate(syncTables(dataset.datasetUri));
        if (!response.errors){
            setItems({
                count:response.data.syncTables.count,
                page:1,
                pages:(response.data.syncTables.count > 0 ? response.data.syncTables.count/10: 1),
                nodes:response.data.syncTables.nodes
            })
            if(response.data.syncTables.count <= 0){
                setMessage({
                    negative: false,
                    positive: true,
                    header: 'Sync Succeeded',
                    content: `No tables found on AWS Glue database ${dataset.GlueDatabaseName}`
                })
            }
            else {
                setMessage({
                    negative: false,
                    positive: true,
                    header: 'Sync Succeeded',
                    content: `Retrieved ${response.data.syncTables.count} tables from AWS Glue catalog`
                })
            }
        }
        else{
            setMessage({
                negative: true,
                positive: false,
                header: 'Sync Error',
                content: `Failed to synchronize tables from AWS Glue catalog due to: ${response.errors[0].message}`
            })
        }
        setSyncingTables(false);
        setFilter(Defaults.DefaultFilter);
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
        const response = await client.query(listDatasetTables({
            datasetUri: dataset.datasetUri,
            filter: {...filter}
        }));
        if (!response.errors) {
            setItems({...response.data.getDataset.tables});
        }
        setLoading(false);
    }

    const isAdmin = () => {
        return ["Creator", "Admin", "Owner"].indexOf(dataset.userRoleForDataset) == -1 ? false : true
    }

    const handlePageChange=async (e,{activePage})=>{
        if (activePage<=items.pages && activePage!==items.page){
            setFilter({...filter, page:activePage});
        }
    }

    const handleTermChange= (e)=>{
        setFilter({...filter,term: e.target.value});
    }

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, filter.page])

    return<div>
        {message && <Message positive={message.positive} negative={message.negative} onDismiss={() => setMessage(null)}>
            <Message.Header>{message.header}</Message.Header>
            <Message.Content>
                <p>{message.content}</p>
            </Message.Content>
        </Message>
        }
        {isAdmin() && <div>
            <Button loading={syncingTables} onClick={synchronizeTables}  size={'mini'} content='Sync Tables' icon='sync alternate' labelPosition='left'/>
            <Button loading={startingCrawler} onClick={startCrawlingDataset}  size={'mini'} content='Crawl Dataset' icon='bug icon' labelPosition='left'/>
            {false &&<Button onClick={() => setShowCrawlerRuns(true)} size={'mini'} content='Crawler Runs' icon='list' labelPosition='left'/>}
        </div>}
        <Divider hidden/>
        <TableContainer
        loading={loading}
        pager={{
            ...items,
            onTermChange:handleTermChange,
            onPageChange:handlePageChange,
            onSearch:fetchItems
        }}
        reload={fetchItems}
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
    />
        <ReactIf.If condition={showCrawlerRuns}>
            <ReactIf.Then>
                <Modal
                    centered={false}
                    onClose={() => setShowCrawlerRuns(false)}
                    onOpen={() => setShowCrawlerRuns(true)}
                    open={() => setShowCrawlerRuns(true)}
                    size='large'
                    closeIcon
                    trigger={<span/>}
                >
                    <Modal.Header>
                        {dataset.label} custom crawler runs
                    </Modal.Header>
                    <Modal.Content>
                        <div></div>
                    </Modal.Content>
                </Modal>
            </ReactIf.Then>
        </ReactIf.If>
    </div>
}

export default TableList;
