import React, {useEffect, useState} from "react";
import {useHistory, Link} from "react-router-dom";
import useClient from "../../../api/client";
import {Button, Dropdown, Grid, Header, Icon, Loader, Message, Modal, Table} from "semantic-ui-react";
import searchRedshiftClusters from '../../../api/RedshiftCluster/searchClusters';
import {PagedResponseDefault} from "../../../components/defaults";
import Pager from "../../../components/pager/Pager";

const Warehouses = ({environment, warehouses, setWarehouses}) => {
    const client = useClient();
    const history = useHistory();
    const [items, setItems] = useState(warehouses ? warehouses : PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchItems = async () => {
        setLoading(true);
        const response = await client.query(searchRedshiftClusters(filter));
        if (!response.errors) {
            setItems({...response.data.searchRedshiftClusters});
            setWarehouses && setWarehouses({...response.data.searchRedshiftClusters});
        }
        else{
            setError({
                header: 'Failed to load warehouses',
                content: `Received ${response.errors[0].message}`
            })
        }
        setLoading(false);
    }
    const handlePageChange = (e,{activePage})=>{
        if (activePage<=items.pages&&activePage!=items.page){
            setFilter({...filter, page:activePage});
        }
    }

    useEffect(() => {
        if (client) {
            if (!warehouses) {
                fetchItems();
            }
        }
    }, [client])

    if (loading){
        return <div
            style={{
                width:'1fr',
                display:'block',
                height:'100%'
            }}
        >
            <Loader active/>
        </div>
    }
    const pager = {
        count:items.count,
        page:filter.page,
        pages:items.pages,
        loading:!loading,
        onSearch:fetchItems,
        onTermChange:(e)=>{setFilter({...filter, term:e.target.value})},
        onPageChange:handlePageChange
    };

    return <div>
        {error &&
            <Message negative>
                <Message.Header>
                    {error && error.header}
                </Message.Header>
                <p>
                    {error && error.content}
                </p>
                <Message.Content>
                    <Button onClick={() => {
                        setError(null)
                    }}>Close</Button>
                </Message.Content>
            </Message>
        }
        <Grid>
            <Grid.Column floated='left' width={9}>
                <Pager {...pager}/>
            </Grid.Column>
            <Grid.Column floated='right' width={3}>
                <Button size='small' name={`url`} onClick={()=>{history.push(`/new-warehouse/${environment.environmentUri}`)}} disabled={false} loading={false}
                        icon labelPosition='left'>
                    <Icon name='plus circle'/>
                    Redshift Cluster
                </Button>
            </Grid.Column>
        </Grid>

        <Table celled compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width={1}>Name</Table.HeaderCell>
                    <Table.HeaderCell width={6}>Endpoint</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Manage</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

                {items && items.nodes && items.nodes.map((node)=>{
                        return <Table.Row>
                            <Table.Cell>
                                {node.label}
                            </Table.Cell>
                            <Table.Cell>
                                {node.endpoint || '-'}
                            </Table.Cell>
                            <Table.Cell>
                                {node.status}
                            </Table.Cell>
                            <Table.Cell>
                                <Button onClick={()=>{history.push(`/warehouse/${node.clusterUri}/Overview`)}}>Manage</Button>
                            </Table.Cell>
                        </Table.Row>
                    })}

        </Table>

    </div>

}

export default Warehouses;
