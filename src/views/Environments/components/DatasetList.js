import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import * as BsIcons from "react-icons/bs";
import {Header} from "semantic-ui-react";
import listDatasetsCreatedInEnvironment from "../../../api/Environment/listDatasetsCreatedInEnvironment";
import {PagedResponseDefault} from "../../../components/defaults";

const DatasetList = ({environment, datasets, setDatasets}) => {
    const client = useClient();
    const [items, setItems] = useState(datasets ? datasets : PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    const [loading, setLoading] = useState(true);
    const fetchItems = async () => {
        setLoading(true);
        const response = await client.query(listDatasetsCreatedInEnvironment({environmentUri: environment.environmentUri}));
        if (!response.errors) {
            setItems({...response.data.listDatasetsCreatedInEnvironment});
            setDatasets && setDatasets({...response.data.listDatasetsCreatedInEnvironment});
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
    return <TableContainer
        loading={loading}
        columns={[
            {label: "Name", key: "label"},
            {label: "AWS Account", key: 'AwsAccountId'},
            {label: 'Region', key: "region"},
            {label: "Bucket", key: "S3BucketName"},
            {label: "Created", key: "created"},
            {label: "Created By", key: "owner"},
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
                </Header>)
            }
        })}
    />
}

export default DatasetList;
