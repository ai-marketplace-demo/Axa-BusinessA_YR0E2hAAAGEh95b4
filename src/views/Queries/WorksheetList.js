import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import {useHistory} from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import useClient from "../../api/client";
import {Button} from "semantic-ui-react";
import * as Defaults from "../../components/defaults";
import * as WorksheetApi from "../../api/Worksheet";
import * as BsIcon from "react-icons/bs";
import * as FiIcon from "react-icons/fi";

const WorksheetLink = ({item}) => {
    return `/worksheet/${item.worksheetUri}/`
}
const WorksheetList = (props) => {
    const history = useHistory();
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const [filter, setFilter] = useState(Defaults.DefaultFilter);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const client = useClient();
    const redirect=async ()=>{
        const response = await client.mutate(WorksheetApi.createWorksheet({label:'untitled'}));
        if (!response.errors){
            history.push(`/worksheet-editor/${response.data.createWorksheet.worksheetUri}`);
        }
    }


    const handlePageChange=(e,{activePage})=>{
        if (activePage<=items.page&&activePage!=items.page){
            setFilter({...filter, page:activePage})
        }
    }

    const fetchItems = async ()=>{
        const response = await client.query(WorksheetApi.listWorksheets({filter:filter}));
        if (!response.errors){
            setItems({...items,nodes:response.data.listWorksheets.nodes.map((node)=>{
                    return {
                        ...node,
                        details:[
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
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, filter.page])

    const action= <Button onClick={redirect} color={`teal`} content='Start Worksheet' icon='right arrow' labelPosition='right' />
    return <DataView
        icon={<AiIcons.AiOutlineExperiment/>}
        title={"Worksheets"}
        action={action}
        linkComponent={WorksheetLink}
        createLink={() => {
            return `/new-worksheet`
        }}
       pager={{
           ...items,
           onPageChange:handlePageChange,
           onTermChange:((e)=>{setFilter({...filter,term:e.target.value})}),
           onSearch : fetchItems,
       }}
        breadcrumbs={"play/worksheets"}
        loading={false}
        collectionable={false}
        commentable={false}
        creatable={true}
        items={items}
        keyField={`worksheetUri`}
    />
}


export default WorksheetList;
