import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import * as BsIcons from "react-icons/bs";
import {Button, Form, Header, Loader, Message} from "semantic-ui-react";
import listAvailableDatasetTables from "../../../api/RedshiftCluster/listAvailableDatasetTables";
import copyTableToCluster from '../../../api/RedshiftCluster/copyTableToCluster';
import {PagedResponseDefault} from "../../../components/defaults";
import Select from "react-select";

const CopyTables = ({warehouse, reload}) => {
    const client = useClient();
    const [items, setItems] = useState(PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:1000});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [itemOptions, setItemOptions] = useState([]);
    const [table, setTable] = useState(null);
    const [schema, setSchema] = useState('');
    const [showInfo, setShowInfo] = useState(true);

    const fetchItems = async () => {
        setLoading(true);
        const response = await client
            .query(listAvailableDatasetTables({
                clusterUri:warehouse.clusterUri,
                filter: filter
            }));
        if (!response.errors) {
            setItems({...response.data.listRedshiftClusterAvailableDatasetTables});
            setItemOptions(response.data.listRedshiftClusterAvailableDatasetTables.nodes.map((e) => {
                return {...e, value: e.tableUri, label: e.label};
            }))
        }
        else{
            setError({
                header: 'Error',
                content: `Could not retrieve tables`
            })
        }
        setLoading(false);
    }
    const handlePageChange = (e,{activePage})=>{
        if (activePage<=items.pages&&activePage!==items.page){
            setFilter({...filter, page:activePage});
        }
    }
    const copyTable = async () => {
        let errors = [];
        if(!table){
            errors.push('Table is mandatory')
        }
        if (errors.length > 0){
            setError({
                header: "Form Error",
                content: errors
            })
        }
        else {
            const res = await client.mutate(copyTableToCluster({
                clusterUri: warehouse.clusterUri,
                datasetUri: table.datasetUri,
                tableUri: table.tableUri,
                schema: schema
            }));
            if (!res.errors) {
                await reload();
                await fetchItems();
                setSuccess({
                    header: 'Success',
                })
            } else {
                setError({
                    header: 'Copy Failed',
                    content: `${res.errors[0].message}`
                })
            }
        }
    };

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client])
    return <div>
        {showInfo &&
            <Message
                positive
                info
                onDismiss={()=>(setShowInfo(false))}
                icon={'info'}
                header={'Tables Copy Subscriptions'}
                content={
                    <p>
                       You can specify a target schema for the copy.
                       The copy will be done on cluster <b>{warehouse.name} </b>
                        and database <b>{warehouse.databaseName}</b>
                    </p>
                }
            />
        }
        {error && <Message negative>
            <Message.Header>{error.header}</Message.Header>
            <p>{error && error.content}</p>
        </Message>
        }
        {success && <Message positive>
            <Message.Header>Table copy subscription saved.</Message.Header>
        </Message>
        }
        {itemOptions &&<Form>
            <Form.Field>
                <label>Table</label>
                <Select value={table}
                        name={'table'}
                        options={itemOptions}
                        onChange={(e)=>{setTable(e)}}/>
            </Form.Field>
            <Form.Field>
                <label>Schema</label>
                <Form.Input
                    icon={'database'}
                    iconPosition={'left'}
                    value={schema}
                    onChange={(e)=>{setSchema(e.target.value)}}
                />
            </Form.Field>
            <Button
                type={'submit'}
                size={'small'}
                color={'blue'}
                loading={''}
                onClick={copyTable}
            >Enable</Button>
        </Form>}

        </div>
}

export default CopyTables;
