import {useState, useEffect} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";
import PipelineListItem from "./PipelineListItem";
import * as Defaults from "../../components/defaults"
import useClient from "../../api/client";
import listSqlPipelines from "../../api/SqlPipeline/listSqlPipelines";

const PipelineLink = ({item}) => {
    return `/pipeline/${item.sqlPipelineUri}/`;
}
const PipelineList = (props) => {
    const client = useClient();
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const handlePageChange=(e,{activePage})=>{
        if (activePage<=items.pages){
            setFilter({...filter, page: activePage})
        }
    }

    const handleTermChange= (e)=>{
        setFilter({...filter,term: e.target.value});
    }
    const fetchItems= async()=>{
        setLoading(true);
        const response = await client.query(listSqlPipelines(filter));
        if (!response.errors){
            setItems({
                ...response.data.listSqlPipelines,
                nodes:response.data.listSqlPipelines.nodes.map((node)=>{
                    return {
                        ...node,
                        details:[
                            {
                                name: 'Role',
                                icon: <BsIcon.BsShield/>,
                                target: node.userRoleForPipeline

                            },
                            {
                                name: 'AWS',
                                icon: <BsIcon.BsCloud/>,
                                target: node.environment.AwsAccountId

                            },
                            {
                                name: 'Region',
                                icon: <FiIcon.FiGlobe/>,
                                target: node.environment.region

                            },
                            {
                                name: 'Status',
                                icon: <FiIcon.FiActivity/>,
                                target: node.stack.status
                            }
                        ]
                    }
                })


            });
        }
        setLoading(false);
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,filter.page])
    return <DataView
        icon={<BsIcon.BsGear/>}
        loading={loading}
        itemBody={PipelineListItem}
        title={"Pipelines"}
        pager={{
            ...items,
            loading,
            onTermChange:handleTermChange,
            onPageChange:handlePageChange,
            onSearch:fetchItems
        }}
        createLink={() => `/new-pipeline`}
        breadcrumbs={`play>pipelines`}
        keyField={`pipelineUri`}
        linkComponent={PipelineLink}
        commentable={false}
        collectionable={false}
        creatable={true}
        items={items}
    />
}


export default PipelineList;
