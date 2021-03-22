import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {If,Then,Else,Switch,Case,Default} from "react-if";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import * as BsIcons from "react-icons/bs";
import {Header} from "semantic-ui-react";
import listDatasetsPublishedInEnvironment from "../../../api/Environment/listDatasetsPublishedInEnvironment";
import {PagedResponseDefault} from "../../../components/defaults";

const SharedList = ({environment, datasets, setDatasets}) => {
    const client = useClient();
    const [items, setItems] = useState(datasets ? datasets : PagedResponseDefault);
    const [loading, setLoading] = useState(true);
    const fetchItems = async () => {
        const response=await client.query(listDatasetsPublishedInEnvironment({environmentUri:environment.environmentUri}));
        if (!response.errors){
            setItems({...response.data.searchEnvironmentDataItems});
            setDatasets && setDatasets({...response.data.listDatasetsCreatedInEnvironment});
        }
        setLoading(false);
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
            {label: "Type", key: "itemType"},
            {label: "Name", key: "GlueTableName"},
            {label: "Dataset", key: "datasetName"},
            {label: "Environment", key: 'environmentName'},
            {label: "Created", key: "created"},
        ]}
        rows={items.nodes.map((node) => {
            return {
                ...node,
                itemType: (<Switch>
                    <Case condition={node.itemType=="DatasetTable"}>
                        <BsIcons.BsTable/>
                    </Case>
                    <Case condition={node.itemType=="DatasetStorageLocation"}>
                        <BsIcons.BsFile/>
                    </Case>
                </Switch>),
                datasetName: (<b><Link target={`_blank`} to={`/dataset/${node.datasetUri}/overview`}>{node.datasetName}</Link></b>),
                environmentName: (<b><Link target={`_blank`} to={`/environment/${node.environmentUri}`}>{node.environmentName}</Link></b>),
            }
        })}
    />
}

export default SharedList;
