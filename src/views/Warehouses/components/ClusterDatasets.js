import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import * as BsIcons from "react-icons/bs";
import {Button, Form, Header, Icon, Message, Modal} from "semantic-ui-react";
import listClusterDatasets from "../../../api/RedshiftCluster/listClusterDatasets";
import removeDatasetFromCluster from "../../../api/RedshiftCluster/removeDatasetFromCluster";
import {PagedResponseDefault} from "../../../components/defaults";
import * as ReactIf from "react-if";
import LoadDatasets from "./LoadDatasets";

const ClusterDatasets = ({warehouse, datasets, setDatasets}) => {
    const client = useClient();
    const [items, setItems] = useState(datasets ? datasets : PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoadDatasets, setShowLoadDatasets] = useState(false);
    const fetchItems = async () => {
        setLoading(true);
        const response = await client
            .query(listClusterDatasets({
                clusterUri:warehouse.clusterUri,
                filter: filter
            }));
        if (!response.errors) {
            setItems({...response.data.listRedshiftClusterDatasets});
            setDatasets && setDatasets({...response.data.listRedshiftClusterDatasets});
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

    useEffect(() => {
        if (client) {
            if (!datasets) {
                fetchItems();
            }
        }
    }, [client])

    const unloadDataset = async (dataset) => {
        const res = await client.mutate(removeDatasetFromCluster({
            clusterUri: warehouse.clusterUri,
            datasetUri: dataset.datasetUri
        }));
        if (!res.errors) {
            await fetchItems();
        } else {
            setError({
                header: 'Error',
                content: `Could not unload dataset ${dataset.label}`
            })
        }
    };
    return <div>
        <Button size='small' name={`url`} onClick={() => setShowLoadDatasets(true)} disabled={false} loading={false}
                icon labelPosition='left'>
            <Icon name='plus circle'/>
            Load Datasets
        </Button>
        <TableContainer
        loading={loading}
        columns={[
            {label: "Name", key: "label"},
            {label: "AWS Account", key: 'AwsAccountId'},
            {label: 'Region', key: "region"},
            {label: "Bucket", key: "S3BucketName"},
            {label: "Created", key: "created"},
            {label: "Created By", key: "owner"},
            {label: "Unload", key:"unload"}
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
                unload:<Button onClick={()=>{unloadDataset(node)}}>Unload</Button>

            }
        })}
    />
        <ReactIf.If condition={showLoadDatasets}>
            <ReactIf.Then>
                <Modal
                    size={'large'}
                    closeIcon
                    centered={false}
                    onClose={() => setShowLoadDatasets(false)}
                    onOpen={() => setShowLoadDatasets(true)}
                    open={() => setShowLoadDatasets(true)}
                    trigger={<span/>}
                >
                    <Modal.Header>
                        <b>{`Load Datasets to cluster ${warehouse.name}` }</b>
                    </Modal.Header>
                    <Modal.Content>
                        {error && <Message negative>
                            <Message.Header>{error.header}</Message.Header>
                            <p>{error && error.content}</p>
                        </Message>
                        }
                        <LoadDatasets warehouse={warehouse} reload={fetchItems}/>
                    </Modal.Content>
                </Modal>
            </ReactIf.Then>
        </ReactIf.If>
    </div>
}

export default ClusterDatasets;
