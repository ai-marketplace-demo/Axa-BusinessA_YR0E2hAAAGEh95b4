import React,{useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import useClient from "../../api/client";
import listDatasets from "../../api/Dataset/listDatasets";
import * as Defaults from "../../components/defaults"
import {Button} from "semantic-ui-react";

const DatasetLink = ({item}) => {
    return `/dataset/${item.datasetUri}/`
}

const DatasetCommentsLink =({uri})=>{
    return `/feed/Dataset/${uri}`;
}

const DatasetList = (props) => {
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
        const response = await client
            .query(listDatasets({
                filter: {
                    ...filter,
                    roles: ['BusinessOwner', 'DataSteward', 'Creator', 'Admin'],
                }
            }))
        if (!response.errors) {
            setItems({
                ...response.data.listDatasets, nodes: response.data.listDatasets.nodes.map((d) => {
                    return {
                        ...d,
                        details: [
                            {
                                name: "Admins",
                                icon: <BsIcon.BsPeople/>,
                                target: d.SamlAdminGroupName
                            },
                            {
                                name: 'Role',
                                icon: <BsIcon.BsShield/>,
                                target: d.userRoleForDataset

                            },
                            {
                                name: 'Tables',
                                icon: <BsIcon.BsTable/>,
                                target: d.statistics.tables
                            },
                            {
                                name: 'Folders',
                                icon: <BsIcon.BsFile/>,
                                target: d.statistics.locations
                            }
                        ]
                    }
                })
            });
            setReady(true);
        } else {

        }
    }
    const action= <div>
        <Button onClick={()=>{history.push('/new-dataset')}} compact={true} basic color={`blue`} content='Create'/>
        <Button onClick={()=>{history.push('/import-dataset')}} compact={true} basic color={`blue`} content='Import'/>
    </div>
    useEffect(() => {
        if (client) {
            fetchItems()
        }
    }, [client, filter.page]);
    return <DataView
        icon={<BsIcon.BsFolder/>}
        title={"Datasets"}
        linkComponent={DatasetLink}
        createLink={() => {
            return `/new-dataset`
        }}
        action={action}
        breadcrumbs={"/catalog/contribute"}
        loading={!ready}
        pager={{
            ...items,
            onTermChange:handleTermChange,
            onPageChange:handlePageChange,
            onSearch:fetchItems
        }}
        items={items}
        commentable={false}
        commentsLink={DatasetCommentsLink}
        collectionable={false}
        creatable={false}
        keyField={`datasetUri`}
        itemBody={() => {
        }}
    />
}


export default DatasetList;
