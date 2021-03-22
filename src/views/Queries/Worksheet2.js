import {useState, useRef,useEffect} from "react";
import {Link,useParams} from "react-router-dom";
import Editor from '@monaco-editor/react';
import * as ReactIf from "react-if";
import {Button,Icon,Tab} from "semantic-ui-react";
import Select from "react-select";
import listEnvironments from "../../api/Environment/listEnvironments";
import runSqlQuery from "../../api/Environment/runSqlQuery"
import * as WorksheetApi from "../../api/Worksheet";
import useClient from "../../api/client";
import  * as Components from "./components";

const Worksheet = ()=>{
    const params = useParams();
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [worksheet, setWorksheet] = useState({worksheetUri:""});
    const client = useClient();
    const valueGetter = useRef();

    const fetchWorksheet =async ()=>{
        const response = await client.query(WorksheetApi.getWorksheet(params.uri));
        if (!response.errors){
            setWorksheet(response.data.getWorksheet);
        }
    }

    useEffect(() => {
        if (client) {
            fetchWorksheet();
        }
    }, [client]);
    return <div>
        <Link style={{color:'blue'}} to={'/worksheets'}>{'<'}back to worksheets</Link>
        <div style={{marginTop:'1rem',color:'dodgerblue',fontSize:'x-large'}}> <b>{worksheet.label}</b></div>
    </div>
}

export default Worksheet;
