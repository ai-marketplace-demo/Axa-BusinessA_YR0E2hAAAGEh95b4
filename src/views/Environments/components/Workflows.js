import React, {useEffect, useState} from "react";
import {useHistory, Link} from "react-router-dom";
import useClient from "../../../api/client";
import {Button, Dimmer, Divider, Grid, Header, Icon, Loader, Message, Modal, Segment, Table} from "semantic-ui-react";
import searchAirflowClusters from '../../../api/AirflowCluster/searchClusters';
import {PagedResponseDefault} from "../../../components/defaults";
import Pager from "../../../components/pager/Pager";
import getAirflowClusterWebLoginToken from "../../../api/AirflowCluster/getClusterConsoleAccess";
import * as SiIcon from "react-icons/si";

const Workflows = ({environment, workflows, setWorkflows}) => {
    const client = useClient();
    const history = useHistory();
    const [items, setItems] = useState(workflows ? workflows : PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoadingUI, setIsLoadingUI] = useState(false);
    const fetchItems = async () => {
        setLoading(true);
        const response = await client.query(searchAirflowClusters(filter));
        if (!response.errors) {
            setItems({...response.data.searchAirflowClusters});
            setWorkflows && setWorkflows({...response.data.searchAirflowClusters});
        }
        else{
            setError({
                header: 'Failed to load workflows',
                content: `Received ${response.errors[0].message}`
            })
        }
        setLoading(false);
    }

    const goToAirflowUI = async (item) => {
        setIsLoadingUI(true)
        const response = await client.query(getAirflowClusterWebLoginToken(item.clusterUri));

        if (!response.errors) {
            window.open(response.data.getAirflowClusterConsoleAccess, '_blank');
        } else {
            setError({
                header: `Airflow Environment ${item.label}`,
                content: `Failed to access Airflow UI due to: ${response.errors[0].message}`
            })
        }
        setIsLoadingUI(false)
    };

    const handlePageChange = (e,{activePage})=>{
        if (activePage<=items.pages&&activePage!=items.page){
            setFilter({...filter, page:activePage});
        }
    }

    useEffect(() => {
        if (client) {
            if (!workflows) {
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

    return <div><Segment style={{borderRadius: "0px"}}>
        <Header as='h3'><SiIcon.SiApacheairflow style={{marginRight: "10px"}}/>Airflow environments</Header>
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
                <div style={{marginTop:"30px"}}>
                    <Button size={'small'} onClick={
                        ()=>{history.push(`/new-workflow/${environment.environmentUri}`)}}>
                        <Icon name={'plus circle'}/>Create
                    </Button>
                </div>
            </Grid.Column>
        </Grid>
        <Dimmer active={isLoadingUI}>
            <Loader size='medium'>Redirecting to AirflowUI</Loader>
        </Dimmer>
        <Table celled compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width={1}>Name</Table.HeaderCell>
                    <Table.HeaderCell width={6}>Airflow UI</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
                {items && items.nodes && items.nodes.map((node)=>{
                        return <Table.Row>
                            <Table.Cell>
                                {node.label}
                            </Table.Cell>
                            <Table.Cell>
                                {node.webServerUrl ?
                                    <Link
                                        style={{color:'#2185d0'}}
                                        onClick={()=>goToAirflowUI(node)}>
                                            {node.webServerUrl} <Icon color={'blue'} name='external alternate'/>
                                    </Link>
                                    : <span>{'-'}</span>
                                }
                            </Table.Cell>
                            <Table.Cell>
                                {node.status}
                            </Table.Cell>
                            <Table.Cell>
                                <Button onClick={()=>{history.push(`/workflow/${node.clusterUri}/Overview`)}} compact={true}>Manage</Button>
                            </Table.Cell>
                        </Table.Row>
                    })}
        </Table>
    </Segment></div>
}

export default Workflows;
