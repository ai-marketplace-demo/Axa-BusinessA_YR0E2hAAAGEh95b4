import React, {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";
import WorkflowListItem from "./WorkflowListItem";
import useClient from "../../api/client";
import * as Defaults from "../../components/defaults";
import * as SiIcon from "react-icons/si";
import searchAirflowClusters from "../../api/AirflowCluster/searchClusters";

const WorflowLink = ({item}) => {
    return `/workflow/${item.clusterUri}/`
}
const WorkflowList = (props) => {
    const [ready, setReady] = useState(false);
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);
    const [loading, setLoading] = useState(true);
    const client = useClient();
    const handlePageChange=(e,{activePage})=>{
        if (activePage<=items.pages){
            setFilter({...filter, page: activePage})
        }
    }

    const handleTermChange= (e)=>{
        setFilter({...filter,term: e.target.value});
    }
    const fetchItems = async () => {
        setReady(false);
        const response = await client.query(searchAirflowClusters(filter));
        if (!response.errors) {
            const nodes = response.data.searchAirflowClusters.nodes.map((workflow) => {
                return {
                    ...workflow, details: [
                        {
                            name: "AWS",
                            icon: <BsIcon.BsCloud/>,
                            target: workflow.AwsAccountId
                        },
                        {
                            name: "Region",
                            icon: <FiIcon.FiGlobe/>,
                            target: workflow.region
                        },

                        {
                            name: 'Role',
                            icon: <BsIcon.BsShield/>,
                            target: workflow.userRoleForCluster

                        },
                        {
                            name: 'Status',
                            icon: <BsIcon.BsAppIndicator/>,
                            target: workflow.CFNStackStatus

                        }
                    ]
                }
            });
            setItems({...items, ...response.data.searchAirflowClusters, nodes: nodes})
        }
        setReady(true);
    };
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client,filter.page])

    return <DataView
        icon={<SiIcon.SiApacheairflow/>}
        title={"Workflows"}
        linkComponent={WorflowLink}
        createLink={() => {
            return `/new-workflow`
        }}
        itemBody={WorkflowListItem}
        breadcrumbs={"/play/workflows"}
        loading={!ready}
        pager={{
            ...items,
            loading,
            onTermChange:handleTermChange,
            onPageChange:handlePageChange,
            onSearch:fetchItems
        }}
        collectionable={false}
        commentable={false}
        creatable={true}
        items={items}
        keyField={`clusterUri`}
    />
}


export default WorkflowList;
