import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import {Button, Form, Header, Icon, Message, Modal} from "semantic-ui-react";
import listClusterDatasetTables from "../../../api/RedshiftCluster/listClusterDatasetTables";
import disableRedshiftClusterDatasetCopy from "../../../api/RedshiftCluster/disableClusterDatasetCopy";
import {PagedResponseDefault} from "../../../components/defaults";
import * as ReactIf from "react-if";
import CopyTables from "./CopyTables";

const ClusterTables = ({warehouse}) => {
    const client = useClient();
    const history = useHistory();
    const [items, setItems] = useState(PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoadDatasets, setShowLoadDatasets] = useState(false);
    const [copyLoading, setCopyLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    const fetchItems = async () => {
        setLoading(true);
        const response = await client
            .query(listClusterDatasetTables({
                clusterUri:warehouse.clusterUri,
                filter: filter
            }));
        if (!response.errors) {
            setItems({...response.data.listRedshiftClusterCopyEnabledTables});
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

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client])

    const disableDatasetCopy = async (table) => {
        setCopyLoading(true);
        const res = await client.mutate(disableRedshiftClusterDatasetCopy({
            clusterUri: warehouse.clusterUri,
            datasetUri: table.datasetUri,
            tableUri: table.tableUri
        }));
        if (!res.errors) {
            await fetchItems();
        } else {
            setError({
                header: 'Error',
                content: `Could not disable dataset ${table.label} copy to Redshift cluster`
            })
        }
        setCopyLoading(false);
    };
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
                    Load datasets first, and subscribe to tables you want to copy to your Amazon Redshift cluster.
                </p>
            }
        />
        }
        <Button size='small' name={`url`} onClick={() => setShowLoadDatasets(true)} disabled={false} loading={false}
                icon labelPosition='left'>
            <Icon name='table'/>
            Subscribe
        </Button>
        <TableContainer
        loading={loading}
        columns={[
            {label: "Name", key: "label"},
            {label: "Schema", key: "RedshiftSchema"},
            {label: "Location", key: "S3Prefix"},
            {label: "Action", key:"copy"}
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
        reload={fetchItems}
        rows={items.nodes.map((node) => {
            return {
                ...node,
                AwsAccountId: <code>{node.AwsAccountId}</code>,
                label: (<b>
                    <Link to={`/table/${node.tableUri}/preview`}>{node.label}</Link>
                </b>
                ),
                RedshiftSchema: '',
                copy:<Button loading={copyLoading} size={'small'} onClick={()=>{disableDatasetCopy(node)}}>Unsubscribe</Button>
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
                        <b>{`Copy tables to cluster ${warehouse.name}` }</b>
                    </Modal.Header>
                    <Modal.Content>
                        {error && <Message negative>
                            <Message.Header>{error.header}</Message.Header>
                            <p>{error && error.content}</p>
                        </Message>
                        }
                        <CopyTables warehouse={warehouse} reload={fetchItems}/>
                    </Modal.Content>
                </Modal>
            </ReactIf.Then>
        </ReactIf.If>
    </div>
}

export default ClusterTables;
