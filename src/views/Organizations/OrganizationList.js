import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import {Link} from "react-router-dom";
import OrganizationListItem from "./OrganizationListItem";
import useClient from "../../api/client";
import listOrganizations from "../../api/Organization/listOrganizations";
import PagedResponseDefault from "../../components/defaults/PagedResponseDefault";

const OrganizationLink = ({item}) => {
    return `/organization/${item.organizationUri}/`;
}
const OrganizationList = (props) => {
    const [ready, setReady] = useState(false);
    const [items, setItems] = useState(PagedResponseDefault);
    const [filter, setFilter] = useState({term:'', page:1,pageSize:5});
    const [loading, setLoading] = useState(true);
    const client = useClient();

    const handlePageChange=async (e,{activePage})=>{
        if (activePage<=items.pages && activePage!==items.page){
            await setFilter({...filter, page:activePage});
        }
    }

    const fetchItems = async () => {
        setReady(false);
        const response = await client.query(listOrganizations({filter:{
            ...filter,
                roles:['Admin','Owner','Member']
            }}));
        if (!response.errors) {
            const nodes = response.data.listOrganizations.nodes.map((org) => {
                return {
                    ...org, details: [
                        {
                            name: "Admins",
                            icon: <BsIcon.BsPeople/>,
                            target: org.SamlGroupName
                        },
                        {
                            name: <Link to={`/environments/${org.organizationUri}`}>Environments</Link>,
                            icon: <BsIcon.BsCloud/>,
                            target: org.stats.environments
                        },
                        {
                            name: 'Role',
                            icon: <BsIcon.BsShield/>,
                            target: org.userRoleInOrganization

                        }
                    ]
                }
            })
            setItems({...items, ...response.data.listOrganizations, nodes: nodes})
        }
        setReady(true);
    }
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client,filter.page])

    return <DataView
        icon={<BsIcon.BsHouse/>}
        title={"Organizations"}
        linkComponent={OrganizationLink}
        createLink={() => {
            return `/new-organization`
        }}
        breadcrumbs={"/onboard/org"}
        loading={!ready}
        collectionable={false}
        commentable={false}
        creatable={true}
        items={items}
        pager={{
            ...items,
            loading:!ready,
            onPageChange:handlePageChange,
            onSearch:fetchItems,
            onTermChange:(e)=>{setFilter({...filter, term:e.target.value})}
        }}
        keyField={`organizationUri`}
        itemBody={OrganizationListItem}
    />
}


export default OrganizationList;
