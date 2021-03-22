import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";
import NotebookListItem from "./NotebookListItem";
import useClient from "../../api/client";
import listSagemakerNotebooks from "../../api/SagemakerNotebook/listSagemakerNotebooks";
import * as Defaults from "../../components/defaults";

const NotebookLink = ({item}) => {
    return `/notebook/${item.notebookUri}/`
}
const NotebookList = (props) => {
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
        const response = await client.query(listSagemakerNotebooks(filter));
        if (!response.errors) {
            const nodes = response.data.listSagemakerNotebooks.nodes.map((notebook) => {
                return {
                    ...notebook, details: [
                        {
                            name: 'Role',
                            icon: <BsIcon.BsShield/>,
                            target: notebook.userRoleForProjectNotebook

                        },
                        {
                            name: 'AWS',
                            icon: <BsIcon.BsCloud/>,
                            target: notebook.environment.AwsAccountId

                        },
                        {
                            name: 'Region',
                            icon: <FiIcon.FiGlobe/>,
                            target: notebook.environment.region

                        },
                        {
                            name: 'Status',
                            icon: <FiIcon.FiActivity/>,
                            target: notebook.stack?.status || notebook.NotebookInstanceStatus
                        }
                    ]
                }
            });
            setItems({...items, ...response.data.listSagemakerNotebooks, nodes: nodes})
        }
        setReady(true);
    };
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client,filter.page])

    return <DataView
        icon={<BsIcon.BsCode/>}
        title={"Notebooks"}
        linkComponent={NotebookLink}
        createLink={() => {
            return `/new-notebook`
        }}
        itemBody={NotebookListItem}
        breadcrumbs={"/play/notebooks"}
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
        keyField={`notebookUri`}
    />
}


export default NotebookList;
