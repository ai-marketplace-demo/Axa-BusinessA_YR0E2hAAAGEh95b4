import React, {useEffect, useState} from "react";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import {Button, Header, Loader, Message} from "semantic-ui-react";
import listDeltaLakeCrawlerRuns from "../../../api/Dataset/listDeltaLakeCrawlerRuns";

const DeltaLakeCrawlerRuns = ({dataset, reload}) => {
    const client = useClient();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchItems = async () => {
        setLoading(true);
        const response = await client
            .query(listDeltaLakeCrawlerRuns({
                datasetUri:dataset.datasetUri,
            }));
        if (!response.errors) {
            setItems(response.data.listDeltaLakeCrawlerRuns);
        }
        else{
            setError({
                header: 'Error',
                content: `Could not retrieve crawler runs ${response.errors[0].message}`
            })
        }
        setLoading(false);
    }

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client])
    return <div>
        {error && <Message negative>
            <Message.Header>{error.header}</Message.Header>
            <p>{error && error.content}</p>
        </Message>
        }
        <TableContainer
            loading={loading}
            reload={fetchItems}
            columns={[
                {label: "Run ID", key: "GlueJobRunId"},
                {label: "Status", key: 'status'},
                {label: "AWS Account", key: 'AwsAccountId'},
                {label: "Created", key: "created"},
            ]}
            rows={items.map((node) => {
                return {
                    ...node,
                    AwsAccountId: <code>{node.AwsAccountId}</code>,
                }
            })}
        /></div>
}

export default DeltaLakeCrawlerRuns;
