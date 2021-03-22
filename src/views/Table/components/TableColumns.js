import React, {useEffect, useState} from "react";
import * as ReactIf from "react-if";
import listDatasetTableColumns from "../../../api/DatasetTable/listDatasetTableColumns";
import syncDatasetTableColumns from "../../../api/DatasetTable/syncDatasetTableColumns";

import {TableContainer} from "../../../components/table";
import {Link} from "react-router-dom";
import {Button, Header} from "semantic-ui-react";
import * as BsIcons from "react-icons/bs";


const TableColumns= ({table, client})=>{
    const [ready,setReady] = useState(false);
    const [filter, setFilter] = useState({page:1, pageSize:65,term:""});
    const [refreshingColumns,setRefreshingColumns]= useState(false);
    const [columns, setColumns]= useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious: false,
        nodes:[]

    })
    const fetchItems = async()=>{
        setReady(false);
        const response = await client.query(listDatasetTableColumns({tableUri:table.tableUri,filter:filter}))
        if (!response.errors){
            setColumns({...response.data.listDatasetTableColumns, nodes: response.data.listDatasetTableColumns.nodes.map((c)=>{
                return {...c, editable:false}
                })});
        }else {
        }
        setReady(true);
    }


    const startSyncColumns=async ()=>{
        setRefreshingColumns(true);
        const response = await client.mutate(syncDatasetTableColumns(table.tableUri));
        if (!response.errors){
            setColumns(response.data.syncDatasetTableColumns)
        }else {

        }
        setRefreshingColumns(false);

    }
    const setEditable=(col)=>{
        setColumns({...columns,nodes:columns.nodes.map((c)=>{
            if (c.columnUri==col.columnUri){
                return {...c, editable:true}
            }else {
                return{...c, editable:false}
            }
        })})
    };
    const unsetEditable=(col)=>{
        setColumns({...columns,nodes:columns.nodes.map((c)=>{
                if (c.columnUri==col.columnUri){
                    return {...c, editable:false}
                }else {
                    return{...c, editable:false}
                }
            })})
    };


    const updateColumn=({column,description})=>{

    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client]);
    return     <TableContainer
        loading={refreshingColumns}
        reload={fetchItems}
        filter={{
            filter:filter,setFilter:setFilter
        }}
        columns={[
            {label: "Name", key: "name"},
            {label: "Type", key: "typeName"},
            {label: "Description", key: "description"},
            {label: "", key: "action",width:'4'},
        ]}
        rows={
            columns.nodes.map((column) => {
                return {
                    ...column,
                    description:<div contentEditable={column.editable}>{column.description}</div>,
                    action:(<ReactIf.If condition={column.editable}>
                        <ReactIf.Then>
                            <Button.Group>
                                <Button primary size={`tiny`}>Save</Button>
                                <Button  size={`tiny`}  onClick={()=>{unsetEditable(column)}}>Cancel</Button>
                            </Button.Group>
                        </ReactIf.Then>
                        <ReactIf.Else>
                            <Button.Group>
                                <Button  size={`tiny`} onClick={()=>{setEditable(column)}} size={`small`}>Edit</Button>
                            </Button.Group>
                        </ReactIf.Else>
                    </ReactIf.If>)
                }
            })
        }
    />
}

export default TableColumns;
