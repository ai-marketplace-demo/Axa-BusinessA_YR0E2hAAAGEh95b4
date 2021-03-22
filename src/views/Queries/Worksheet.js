import {useState, useRef,useEffect} from "react";
import {Link} from "react-router-dom";
import Editor from '@monaco-editor/react';
import * as ReactIf from "react-if";
import {Button,Icon,Tab} from "semantic-ui-react";
import Select from "react-select";
import listEnvironments from "../../api/Environment/listEnvironments";
import runSqlQuery from "../../api/Environment/runSqlQuery"

import useClient from "../../api/client";
import  * as Components from "./components";

const Worksheet = ()=>{
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isResultsPanelMaximized,setIsResultsPanelMaximized] = useState(false);
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [ready, setReady] = useState(false);
    const [results, setResults] = useState({rows:[], fields:[]});
    const [chartResults, setChartResults] = useState({rows:[], fields:[]});
    const  [loading, setLoading] = useState(false);
    const  [chartConfig, setChartConfig] = useState({
        measures:{},
        logs:[],
        dimensions:{},
        type : {label:'line', value:'line'}
    });
    const [chartQuery, setChartQuery] = useState("");
    const [sqlBody,setSqlBody] = useState(" select 'A' as dim, 23 as nb\n union \n select 'B' as dim, 43 as nb ")
    const [currentEnv, setCurrentEnv]=useState();
    const client = useClient();
    const valueGetter = useRef();
    function handleEditorDidMount(_valueGetter) {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
    }

    const fetchEnvironments = async () => {
        const response = await client.query(listEnvironments({filter: {roles: ["Admin", "Owner", "Invited", "DatasetCreator"]}}));
        if (!response.errors) {
            setEnvironmentOptions(response.data.listEnvironments.nodes.map((e) => {
                return {...e, value: e.environmentUri, label: e.label};
            }))
        }
        setReady(true)
    }

    const runQuery=async ()=>{
        setLoading(true);
        const response = await client.query(runSqlQuery({
            environmentUri:currentEnv.value,
            sqlQuery:sqlBody
        }));
        if (!response.errors){
            setResults(response.data.runAthenaSqlQuery)
        }
        setLoading(false);

    }

    const runChartQuery=async ()=>{
        setLoading(true);
        const response = await client.query(runSqlQuery({
            environmentUri:currentEnv.value,
            sqlQuery:chartQuery
        }));
        if (!response.errors){
            setChartResults(response.data.runAthenaSqlQuery)
        }
        setLoading(false);
    }

    const refreshChart= async ({query})=>{
        await setChartQuery(query);
        await runChartQuery();
    }
    const updateMeasure= (column)=>{
        if (chartConfig.measures[column.columnName]){
            setChartConfig({...chartConfig, measures: {...chartConfig.measures,[column.columnName]:column}})
        }
    }
    const addMeasure= (column)=>{
        if (!chartConfig.measures[column.columnName]){
            const tmp = {...chartConfig.measures}
            tmp[column.columnName]=column;
            setChartConfig({...chartConfig, measures: tmp})
        }
    }
    const removeMeasure= (column)=>{
        if (chartConfig.measures[column.columnName]){
            const tmp = {...chartConfig.measures}
            delete tmp[column.columnName];
            setChartConfig({...chartConfig, measures: tmp})
        }
    }

    const addDimension= (column)=>{
        if (!chartConfig.dimensions[column.columnName]){
            const tmp = {...chartConfig.dimensions}
            tmp[column.columnName]=column;
            setChartConfig({...chartConfig, dimensions: tmp});
        }
    }
    const removeDimension= (column)=>{
        if (chartConfig.dimensions[column.columnName]){
            const tmp = {...chartConfig.dimensions}
            delete tmp[column.columnName];
            setChartConfig({...chartConfig, dimensions: tmp})
        }
    }

    useEffect(() => {
        if (client) {
            fetchEnvironments();
        }
    }, [client]);
    return <div>
        <Link style={{color:'blue'}} to={'/queries'}>{'<'}back to queries</Link>
        <div style={{marginTop:'1rem',color:'dodgerblue',fontSize:'x-large'}}> <b>SQL Worksheet</b></div>

        <ReactIf.If condition={!isResultsPanelMaximized}>
            <ReactIf.Then>
                <div style={{marginTop:'1rem',columnGap:'2rem',display:"grid", gridTemplateColumns:'30% 25%'}}>
                    <Select placeholder={`Select target environment`} options={environmentOptions} onChange={(opt)=>{setCurrentEnv(opt)}} value={currentEnv}/>
                    <Button onClick={runQuery} style={{width:'30%'}} size={`small`} primary icon labelPosition='right'>
                        Run
                        <Icon name={`play`}/>
                    </Button>
                </div>
                <div style={{
                    height:'35ch',
                    overflowY:'hidden',
                    overflowX:'hidden',
                    marginTop:'1rem',
                    rowGap:'1rem',
                    gridTemplateColumns:'30% 69%',
                    columnGap:'1px',
                    display:"grid",
                    }}>
                    <Components.DatabaseBrowser client={client} environment={currentEnv}/>
                    <div style={{height:'100%'}}>
                        <Components.SQLQueryEditor
                            sql={sqlBody}
                            onChange={setSqlBody}
                        />
                    </div>
                </div>
            </ReactIf.Then>
        </ReactIf.If>
        <div>
           <Components.ResultsPanel
               results={results}
               loading={loading}
               chart={{
                   config:chartConfig,
                   results:chartResults,
                   query:sqlBody,
                   chartQuery:chartQuery,
                   addDimension,
                   updateChartQuery:setChartQuery,
                   refresh:refreshChart,
                   removeDimension,
                   addMeasure,
                   removeMeasure,
                   updateMeasure
               }}
               toggle={()=>{setIsResultsPanelMaximized(!isResultsPanelMaximized)}}/>
        </div>
    </div>
}

export default Worksheet;
