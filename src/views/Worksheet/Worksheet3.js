import React, {useState, useRef,useEffect} from "react";
import {Link,useParams} from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import * as ReactIf from "react-if";
import * as WorksheetApi from "../../api/Worksheet";
import useClient from "../../api/client";
import styled from "styled-components";
import * as Components from "./components";
import {Label,Button,Icon,Modal,Loader} from "semantic-ui-react";
import {useEnvironments} from "../Environments";
import useAthenaQueryResults from "./hooks/useQueryResults";
import * as Layout from "./styles";
import Select from "react-select";

const Worksheet = ()=>{
    const params = useParams();
    const [hasBeenRun, setHasBeenRun] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isShareView, setIsShareView] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [worksheet, setWorksheet] = useState(null);

    const [resultPanelMaximized, setResultPanelMaximized]= useState(false);
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [currentEnv, setCurrentEnv]=useState();
    const client = useClient();
    const [currentQuery, setCurrentQuery] = useState(null);
    const environments = useEnvironments({client,page:1});

    const {results, error} = useAthenaQueryResults({
        client,
        worksheetUri:params.uri,
        environmentUri:currentEnv&&currentEnv.value,
        query:currentQuery,
        onComplete: ()=>{setIsRunning(false)}
    });




    const startQuery = ()=> {
        setIsRunning(true);
        setHasBeenRun(true);
        setCurrentQuery(worksheet.sqlBody);
    }



    const updateWorksheet = async()=>{
        setIsSaving(true);
        const response = await client.mutate(WorksheetApi.updateWorksheet({
            worksheetUri:params.uri,
            input:{
                label:worksheet.label,
                sqlBody: worksheet.sqlBody,
                description:worksheet.description,
                tags: worksheet.tags,
                chartConfig: {
                    chartType:worksheet.chartConfig.chartType,
                    measures:worksheet.chartConfig.measures.map((d)=>{return {columnName:d.columnName, aggregationType:d.aggregationType}}),
                    dimensions:worksheet.chartConfig.dimensions.map((d)=>{return {columnName:d.columnName}}),
                }
            }
        }));
        setIsSaving(false);
    }
    const fetchWorksheet =async ()=>{
        const response = await client.query(WorksheetApi.getWorksheet(params.uri));
        if (!response.errors){
            setWorksheet(response.data.getWorksheet);
        }else {
            console.log(response.errors);
        }
    }

    const disableRun=()=>{
        if (!worksheet.sqlBody){
            return true
        }
        if (!worksheet.sqlBody.length){
            return true
        }
        if (isRunning){
            return true
        }
        if (!currentEnv){
            return true
        }
        return false
    }


    useEffect(() => {
        if (client) {
            fetchWorksheet();

        }
    }, [client]);

    useEffect(()=>{
        setEnvironmentOptions(environments.nodes.map((e)=>{
            return {label : e.label, value:e.environmentUri}
        }));
    },[environments]);

    if (!worksheet){
        return <div style={{
            display:'grid',
            height:'100%',
            placeItems:'center'
        }}>
            <Loader active={true}>
                <i>{`Loading worksheet`}</i>
            </Loader>
        </div>
    }
    return <Layout.MainLayout>
        <ReactIf.If condition={isShareView}>
            <ReactIf.Then>
                <Modal
                    centered={false}
                    onClose={() => setIsShareView(false)}
                    onOpen={() => setIsShareView(true)}
                    open={isShareView}
                    size='small'
                    trigger={<Button>Basic Modal</Button>}
                >
                    <Modal.Content>
                        <p>
                            Manage worksheet permissions
                        </p>
                        <Components.WorksheetShareManager
                            client={client}
                            worksheet={worksheet}
                            api={WorksheetApi}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic={true} onClick={() => setIsShareView(false)}>
                            close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </ReactIf.Then>
        </ReactIf.If>
       <Layout.TitleLayout>
           <Link to={`/worksheets`}>
               <div style={{fontSize:'smaller',color:'blue'}}>
                   {`< Back to worksheets`}
               </div>
           </Link>
           <Layout.Title>
               <div><AiIcons.AiOutlineExperiment/></div>
               <div style={{fontSize:'x-large'}}>
                   <Components.Editable
                       content={worksheet.label}
                       onChange={(e)=>{setWorksheet({...worksheet,label:e.target.value})}}
                       onSave={updateWorksheet}
                   />
               </div>
               <div style={{fontSize:"smaller", color:'darkgray'}}>| {`play>worksheet`}</div>
               <div style={{fontSize:'xx-small',fontWeight:'bolder',gridColumnStart:1,gridColumnEnd:4}}>
                   {worksheet.owner} | {worksheet.created}
               </div>
               <div/>
               <Label  tag  color='teal'>{worksheet.userRoleForWorksheet}</Label>
           </Layout.Title>
       </Layout.TitleLayout>
        <Layout.ComponentLayout>
            <Layout.EditorLayout>
                <Layout.EditorControlsLayout>
                    <Button disabled={disableRun()} onClick={startQuery} compact size={`tiny`} color={`blue`} icon labelPosition={`right`} basic>Run <Icon name={`play`}/></Button>
                    <Button loading={isSaving} compact size={`tiny`} onClick={updateWorksheet} color={`blue`} icon labelPosition={`right`} basic>Save <Icon name={`save outline`}/> </Button>
                    <Button loading={isSaving} compact size={`tiny`} onClick={()=>{setIsShareView(!isShareView)}} color={`blue`} icon labelPosition={`right`} basic>Share <Icon name={`share square`}/> </Button>
                    <div/>
                    <Select
                        placeHolder={`Select target environment`}
                        value={currentEnv}
                        onChange={(opt)=>{setCurrentEnv(opt)}}
                        options={environmentOptions}/>
                </Layout.EditorControlsLayout>
                <Components.SQLQueryEditor
                    sql={worksheet.sqlBody}
                    disabled={isRunning}
                    onChange={(v)=>{setWorksheet({...worksheet,sqlBody:v})}}
                />
            </Layout.EditorLayout>
            <Layout.ResultLayout>
                <Components.WorksheetResult
                    maximized={resultPanelMaximized}
                    environment={currentEnv}
                    results={hasBeenRun?results:worksheet.lastSavedQueryResult}
                    currentQuery={currentQuery}
                    onChange={(data)=>{setWorksheet({...data})}}
                    toggle={()=>{setResultPanelMaximized(!resultPanelMaximized)}}
                    worksheet={worksheet}
                    client={client}
                />
            </Layout.ResultLayout>
        </Layout.ComponentLayout>

    </Layout.MainLayout>
}


export default Worksheet;
