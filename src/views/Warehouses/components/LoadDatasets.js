import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import * as BsIcons from "react-icons/bs";
import {Button, Header, Loader, Message} from "semantic-ui-react";
import listRedshiftClusterAvailableDatasets from "../../../api/RedshiftCluster/listAvailableDatasets";
import addDatasetToCluster from '../../../api/RedshiftCluster/addDatasetToCluster';
import {PagedResponseDefault} from "../../../components/defaults";

const LoadDatasets = ({warehouse, reload, datasets, setDatasets}) => {
    const client = useClient();
    const [items, setItems] = useState(datasets ? datasets : PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const fetchItems = async () => {
        setLoading(true);
        const response = await client
            .query(listRedshiftClusterAvailableDatasets({
                clusterUri:warehouse.clusterUri,
                filter: filter
            }));
        if (!response.errors) {
            setItems({...response.data.listRedshiftClusterAvailableDatasets});
            setDatasets && setDatasets({...response.data.listRedshiftClusterAvailableDatasets});
        }
        else{
            setError({
                header: 'Error',
                content: `Could not retrieve datasets`
            })
        }
        setLoading(false);
    }
    const handlePageChange = (e,{activePage})=>{
        if (activePage<=items.pages&&activePage!=items.page){
            setFilter({...filter, page:activePage});
        }
    }

    const loadDataset = async (dataset) => {
        const res = await client.mutate(addDatasetToCluster({
            clusterUri: warehouse.clusterUri,
            datasetUri: dataset.datasetUri
        }));
        if (!res.errors) {
            await reload();
            await fetchItems();
            setSuccess({
                header: 'Success',
            })
        } else {
            setError({
                header: 'Loading Failed',
                content: `${res.errors[0].message}`
            })
        }
    };

    useEffect(() => {
        if (client) {
            if (!datasets) {
                fetchItems();
            }
        }
    }, [client])
    return <div>
        <Message>
            <Message.Header>Load Datasets</Message.Header>
            <p>You can load datasets to you Redshift cluster using Spectrum with 'Load' feature.</p>
        </Message>
        {error && <Message negative>
            <Message.Header>{error.header}</Message.Header>
            <p>{error && error.content}</p>
        </Message>
        }
        {success && <Message positive>
            <Message.Header>Dataset loading to cluster started</Message.Header>
        </Message>
        }
        <TableContainer
        loading={loading}
        columns={[
            {label: "Name", key: "label"},
            {label: "AWS Account", key: 'AwsAccountId'},
            {label: 'Region', key: "region"},
            {label: "Bucket", key: "S3BucketName"},
            {label: "Created By", key: "owner"},
            {label: "Load", key:"link"}
        ]}
        pager={{
            count:items.count,
            page:filter.page,
            pages:items.pages,
            loading:!loading,
            onSearch:fetchItems,
            onTermChange:(e)=>{setFilter({...filter, term:e.target.value})},
            onPageChange:handlePageChange
        }}
        rows={items.nodes.map((node) => {
            return {
                ...node,
                AwsAccountId: <code>{node.AwsAccountId}</code>,
                label: (<Header as='h4' image>
                    <BsIcons.BsFolder/>
                    <Header.Content>
                        <Link to={`/dataset/${node.datasetUri}/overview`}>{node.label}</Link>
                        <Header.Subheader>
                            <Link to={`/dataset/${node.datasetUri}/overview`}>{node.datasetUri}</Link>
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                ),
                link:<Button onClick={()=>{loadDataset(node)}}>Load</Button>

            }
        })}
    /></div>
}

export default LoadDatasets;
