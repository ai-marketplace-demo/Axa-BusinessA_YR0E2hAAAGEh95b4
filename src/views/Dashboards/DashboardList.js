import {useState, useEffect} from "react";
import DataView from "../../components/listview/DataView";
import * as MdIcons from "react-icons/md";
import DashboardListItem from "./DashboardListItem";
import {Button,Icon} from "semantic-ui-react";
import {useHistory} from "react-router";
import useClient from "../../api/client";
import searchDashboards from "../../api/Dashboard/searchDashboards";
import * as Defaults from "../../components/defaults";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";
const DashboardLink = ({item}) => {
    return `/dashboard/${item.dashboardUri}/`
}

const DashboardList = (props) => {
    const client = useClient();
    const [items,setItems] = useState(Defaults.PagedResponseDefault) ;
    const [filter,setFilter] = useState(Defaults.DefaultFilter) ;
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const redirect=()=>{
        history.push("/qs/select")
    }
    const action= <Button onClick={redirect} compact={true} color={`blue`} content='Start Session' icon='right arrow' labelPosition='right' />

    const handlePageChange=(e,{activePage})=>{
        if (activePage<=items.pages){
            setFilter({...filter, page: activePage})
        }
    }

    const handleTermChange= (e)=>{
        setFilter({...filter,term: e.target.value});
    }
    const fetchItems=async ()=>{
        setLoading(true);
        const response = await client.query(
            searchDashboards({})
        )
        if (!response.errors){
            setItems({
                ...response.data.searchDashboards,
                nodes:response.data.searchDashboards.nodes.map((node)=>{
                    return {
                        ...node,
                        details:[
                            {
                                name: 'Admins',
                                icon: <BsIcon.BsPeople/>,
                                target: node.SamlGroupName
                            },
                            {
                                name: 'aws',
                                icon: <BsIcon.BsCloud/>,
                                target: node.environment.AwsAccountId
                            },
                            {
                                name: 'region',
                                icon: <FiIcon.FiGlobe/>,
                                target: node.environment.region
                            },
                        ]
                    }
                })
            });
        }else {
            setError(`Could not retrieved dashboards, received ${response.errors[0].message}`);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,filter.page]);

    return <DataView
        icon={<MdIcons.MdShowChart/>}
        action={action}
        createLabel={`Import`}
        loading={loading}
        pager={{
            ...items,
            loading,
            onTermChange:handleTermChange,
            onPageChange:handlePageChange,
            onSearch:fetchItems
        }}
        title={"Dashboards"}
        linkComponent={DashboardLink}
        createLink={() => {
            return `/new-dashboard`
        }}
        breadcrumbs={`play>dashboards`}
        keyField={`dashboardUri`}
        itemBody={DashboardListItem}
        commentable={false}
        collectionable={false}
        creatable={true}
        items={items}
    />
}


export default DashboardList;

