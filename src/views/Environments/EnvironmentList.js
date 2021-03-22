import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";
import EnvironmentListItem from "./EnvironmentListItem";
import {useParams} from "react-router-dom";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";
import listOrganizationEnvironments from "../../api/Environment/listOrganizationEnvironments";

const EnvironmentLink = ({item}) => {
    return `/environment/${item.environmentUri}/`
}
const EnvironmentList = (props) => {
    const params = useParams();
    const [ready, setReady] = useState(false);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    const [items, setItems] = useState({count: 0, page: 1, pages: 1, hasNext: false, hasPrevious: false, nodes: []})
    const [loading, setLoading] = useState(true);
    const client = useClient();

    const handlePageChange = (e,{activePage})=>{
        if (activePage<=items.pages&&activePage!=items.page){
            setFilter({...filter, page:activePage});
        }
    }

    const fetchItems = async () => {
        setReady(false);
        let query;
        let resolve;
        if (params.uri) {
            query = listOrganizationEnvironments({organizationUri: params.uri,filter:{...filter}})
            resolve = (r) => {
                return r.data.getOrganization.environments;
            }

        } else {
            query = listEnvironments({
                ...filter,
                roles:['Owner','Admin', 'Invited', 'DatasetCreator']
            })
            resolve = (r) => {
                return r.data.listEnvironments;
            }
        }
        const response = await client.query(query);
        if (!response.errors) {
            const nodes = resolve(response).nodes.map((env) => {
                return {
                    ...env, details: [
                        {
                            name: "AWS",
                            icon: <BsIcon.BsCloud/>,
                            target: env.AwsAccountId
                        },
                        {
                            name: "Region",
                            icon: <FiIcon.FiGlobe/>,
                            target: env.region
                        },

                        {
                            name: "Admins",
                            icon: <BsIcon.BsPeople/>,
                            target: env.SamlAdminGroupName
                        },

                        {
                            name: 'Role',
                            icon: <BsIcon.BsShield/>,
                            target: env.userRoleInEnvironment

                        },
                        {
                            name: 'Status',
                            icon: <BsIcon.BsAppIndicator/>,
                            target: env.stack.status

                        }
                    ]
                }
            })
            setItems({...items, ...resolve(response), nodes: nodes})
        }
        setReady(true);
    }

    useEffect(() => {
        if (client) {
            fetchItems();
        }
    }, [client,filter.page,params.uri])

    return <DataView
        icon={<BsIcon.BsCloud/>}
        title={"Environments"}
        loading={!ready}
        linkComponent={EnvironmentLink}
        createLink={() => {
            return `/new-environment/${params.uri}`
        }}
        pager={{
            count:items.count,
            page:filter.page,
            pages:items.pages,
            loading:!ready,
            onSearch:fetchItems,
            onTermChange:(e)=>{setFilter({...filter, term:e.target.value})},
            onPageChange:handlePageChange
        }}
        breadcrumbs={params.uri ? `/onboard/org/${params.uri}/environments` : `on boarding/environments`}
        creatable={params.uri ? true : false}
        commentable={false}
        items={items}
        keyField={`environmentUri`}
        itemBody={EnvironmentListItem}
    />

}


export default EnvironmentList;
