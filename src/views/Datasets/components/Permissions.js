import React, {useEffect, useState} from "react";
import listDatasetShareObjects from "../../../api/ShareObject/listDatasetShareObjects";
import useClient from "../../../api/client";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import TableContainer from "../../../components/table/table";
import {Button} from "semantic-ui-react";
import {useHistory} from "react-router";
import * as BsIcons from "react-icons/bs";

const PermissionList = ({dataset, shares, setShares}) => {
    const history = useHistory();
    const client = useClient();
    const [items, setItems] = useState(shares ? shares : PagedResponseDefault);
    const [loading, setLoading] = useState(true);

    const redirectToShare =(share)=>{
        history.push(`/share/${share.shareUri}/`)
    }
    const fetchItems = async () => {
        const response = await client.query(listDatasetShareObjects({datasetUri: dataset.datasetUri}));
        if (!response.errors) {
            setItems({...response.data.getDataset.shares});
            setShares && setShares({...response.data.getDataset.shares});
        }
        setLoading(false);
    }


    useEffect(() => {
        if (client) {
            if (!shares) {
                fetchItems();
            }
        }
    }, [client])
    return <TableContainer
        loading={loading}
        columns={[
            {label: "With", key: "with"},
            {label: "Status", key: "status"},
            {label: "Org", key: "organization"},
            {label: "AwsAccountId", key: "AwsAccountId"},
            {label: "region", key: "region"},
            {label: "action", key: "action"},
        ]}
        rows={
            items.nodes.map((share) => {
                return {
                    ...share,
                    region: share.principal.region,
                    AwsAccountId: share.principal.AwsAccountId,
                    with: <div><BsIcons.BsPeople/> {share.principal.SamlGroupName}</div>,
                    organization: <div>{share.principal.organizationName}</div>,
                    action: <Button onClick={()=>{redirectToShare(share)}}>Manage</Button>
                }
            })
        }
    />
}


export default PermissionList;
