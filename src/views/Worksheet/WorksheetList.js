import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import {useHistory} from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import useClient from "../../api/client";
import {Button} from "semantic-ui-react";
import * as Defaults from "../../components/defaults";
import * as WorksheetApi from "../../api/Worksheet";
import * as BsIcon from "react-icons/bs";

const WorksheetLink = ({item}) => {
    return `/worksheet/${item.worksheetUri}/`
}

const WorksheetCommentLink=({uri})=>{
    return `/feed/Worksheet/${uri}`
}
const WorksheetList = (props) => {
    const history = useHistory();
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const client = useClient();

    const redirect=async ()=>{
        setCreating(true);
        const response = await client.mutate(WorksheetApi.createWorksheet({label:'untitled'}));
        setCreating(false);
        if (!response.errors){
            history.push(`/worksheet/${response.data.createWorksheet.worksheetUri}`);
        }
    }


    const handlePageChange=async (e,{activePage})=>{
        if (activePage<=items.pages && activePage!==items.page){
            await setFilter({...filter, page:activePage});
        }
    }

    const fetchItems = async ()=>{
        setLoading(true);
        const response = await client.query(WorksheetApi.listWorksheets({filter:filter}));
        if (!response.errors){
            setItems({...response.data.listWorksheets,nodes:response.data.listWorksheets.nodes.map((node)=>{
                    return {
                        ...node,
                        details:[
                            {
                                name: "Admins",
                                icon: <BsIcon.BsPeople/>,
                                target: node.SamlAdminGroupName
                            },

                            {
                                name: 'Role',
                                icon: <BsIcon.BsShield/>,
                                target: node.userRoleForWorksheet

                            }
                        ]
                    }
                })})
        }else {
            setError(response.errors[0].message);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, filter.page])

    const action= <Button loading={creating} onClick={redirect} color={`blue`} content='Start Worksheet' icon='right arrow' labelPosition='right' />
    return <DataView
        icon={<AiIcons.AiOutlineExperiment/>}
        title={"Worksheets"}
        creatable={false}
        action={action}
        loading={loading}
        linkComponent={WorksheetLink}
       pager={{
           ...items,
           loading:loading,
           onPageChange:handlePageChange,
           onTermChange:((e)=>{setFilter({...filter,term:e.target.value})}),
           onSearch : fetchItems,
       }}
        breadcrumbs={"play/worksheets"}
        collectionable={false}
        commentable={false}
        commentsLink={WorksheetCommentLink}
        items={items}
        keyField={`worksheetUri`}
    />
}


export default WorksheetList;
