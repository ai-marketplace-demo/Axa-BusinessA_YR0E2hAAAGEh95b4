import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";
import SagemakerStudioListItem from "./SagemakerStudioListItem";
import useClient from "../../api/client";
import listSagemakerStudioUserProfiles from "../../api/SagemakerStudio/listSagemakerStudioUserProfiles";
import * as Defaults from "../../components/defaults";

const SagemakerStudioUserProfileLink = ({item}) => {
    return `/notebook/${item.sagemakerStudioUserProfileUri}/`
}
const SagemakerStudioList = (props) => {
    const [ready, setReady] = useState(false);
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);
    const [loading, setLoading] = useState(true);
    const client = useClient();
    const handlePageChange = (e, {activePage}) => {
        if (activePage <= items.pages) {
            setFilter({...filter, page: activePage})
        }
    }

    const handleTermChange = (e) => {
        setFilter({...filter, term: e.target.value});
    }
    const fetchItems = async () => {
        setReady(false);
        const response = await client.query(listSagemakerStudioUserProfiles(filter));
        if (!response.errors) {
            const nodes = response.data.listSagemakerStudioUserProfiles.nodes.map((SagemakerStudioUserProfile) => {
                return {
                    ...SagemakerStudioUserProfile, details: [
                        {
                            name: 'Role',
                            icon: <BsIcon.BsShield/>,
                            target: SagemakerStudioUserProfile.userRoleForSagemakerStudioUserProfile

                        },
                        {
                            name: 'AWS',
                            icon: <BsIcon.BsCloud/>,
                            target: SagemakerStudioUserProfile.environment.AwsAccountId

                        },
                        {
                            name: 'Region',
                            icon: <FiIcon.FiGlobe/>,
                            target: SagemakerStudioUserProfile.environment.region

                        },
                        {
                            name: 'Status',
                            icon: <FiIcon.FiActivity/>,
                            target: SagemakerStudioUserProfile.stack?.status || SagemakerStudioUserProfile.sagemakerStudioUserProfileStatus
                        }
                    ]
                }
            });
            setItems({...items, ...response.data.listSagemakerStudioUserProfiles, nodes: nodes})
        }
        setReady(true);
    };
    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client, filter.page])

    return <DataView
        icon={<BsIcon.BsCode/>}
        title={"Notebooks"}
        linkComponent={SagemakerStudioUserProfileLink}
        createLink={() => {
            return `/new-notebook`
        }}
        itemBody={SagemakerStudioListItem}
        breadcrumbs={"/play/notebooks"}
        loading={!ready}
        pager={{
            ...items,
            loading,
            onTermChange: handleTermChange,
            onPageChange: handlePageChange,
            onSearch: fetchItems
        }}
        collectionable={false}
        commentable={false}
        creatable={true}
        items={items}
        keyField={`sagemakerStudioUserProfileUri`}
    />
}


export default SagemakerStudioList;
