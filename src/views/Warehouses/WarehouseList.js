import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";
import WorkflowListItem from "./WorkflowListItem";
import useClient from "../../api/client";
import * as Defaults from "../../components/defaults";
import * as SiIcon from "react-icons/si";
import searchRedshiftClusters from "../../api/RedshiftCluster/searchClusters";
import {Button} from "semantic-ui-react";

const WarehouseLink = ({item}) => {
    return `/warehouse/${item.clusterUri}/`
}
const WarehouseList = (props) => {
    const [ready, setReady] = useState(false);
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);
    const [loading, setLoading] = useState(true);
    const client = useClient();
    const history = useHistory();
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
        const response = await client.query(searchRedshiftClusters(filter));
        if (!response.errors) {
            const nodes = response.data.searchRedshiftClusters.nodes.map((warehouse) => {
                return {
                    ...warehouse, details: [
                        {
                            name: "AWS",
                            icon: <BsIcon.BsCloud/>,
                            target: warehouse.AwsAccountId
                        },
                        {
                            name: "Region",
                            icon: <FiIcon.FiGlobe/>,
                            target: warehouse.region
                        },

                        {
                            name: 'Role',
                            icon: <BsIcon.BsShield/>,
                            target: warehouse.userRoleForCluster

                        },
                        {
                            name: 'Status',
                            icon: <BsIcon.BsAppIndicator/>,
                            target: warehouse.stack.status

                        }
                    ]
                }
            });
            setItems({...items, ...response.data.searchRedshiftClusters, nodes: nodes})
        }
        setReady(true);
    };
    const action= <div>
        <Button onClick={()=>{history.push('/new-warehouse')}} compact={true} basic color={`blue`} content='Create'/>
        <Button onClick={()=>{history.push('/import-warehouse')}} compact={true} basic color={`blue`} content='Import'/>
    </div>
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client,filter.page])

    return <DataView
        icon={<FiIcon.FiBox/>}
        title={"Warehouses"}
        linkComponent={WarehouseLink}
        createLink={() => {
            return `/new-warehouse`
        }}
        itemBody={WorkflowListItem}
        breadcrumbs={"/play/warehouses"}
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
        creatable={false}
        items={items}
        keyField={`clusterUri`}
        action={action}
    />
}


export default WarehouseList;
