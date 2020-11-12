import React, {useState, useRef,useEffect} from "react";
import {Container, Row, Col, Spinner, Badge,Table} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Editor from '@monaco-editor/react';
import {If, Then, Else, Case, Switch, Default} from "react-if";
import useClient from "../../api/client";
import listEnvironments from "../../api/Environment/listEnvironments";
import getSavedQuery from "../../api/SavedQuery/getSavedQuery";
import updateSavedQuery from "../../api/SavedQuery/updateSavedQuery";
import runSavedQuery from "../../api/SavedQuery/runSavedQuery";
import Select from "react-select";
import styled from "styled-components";
import {toast} from "react-toastify";
import {getRegionLabel} from "../../components/AwsRegions/AwsRegionSelect";
import {Link, useParams} from "react-router-dom";
import ResizePanel from "react-resize-panel";
import QueryAdmin from "./SavedQueryAdminView";

const StyledInput=styled.div`

& input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #CCC;
  color: #555;
  &:focus {
    outline: none;    
  }
}

`


const TableStyled=styled.div`
.ExcelTable2007 {
	border: 1px solid #B0CBEF;
	border-width: 1px 0px 0px 1px;
	font-size: 11pt;
	font-family: Calibri;
	font-weight: 100;
	border-spacing: 0px;
	border-collapse: collapse;
}

.ExcelTable2007 TH {
	background-image: url(excel-2007-header-bg.gif);
	background-repeat: repeat-x; 
	font-weight: normal;
	font-size: 14px;
	border: 1px solid #9EB6CE;
	border-width: 0px 1px 1px 0px;
	height: 17px;
}

.ExcelTable2007 TD {
	border: 0px;
	background-color: white;
	padding: 0px 4px 0px 2px;
	border: 1px solid #D0D7E5;
	border-width: 0px 1px 1px 0px;
}

.ExcelTable2007 TD B {
	border: 0px;
	background-color: white;
	font-weight: bold;
}

.ExcelTable2007 TD.heading {
	background-color: #E4ECF7;
	text-align: center;
	border: 1px solid #9EB6CE;
	border-width: 0px 1px 1px 0px;
}

.ExcelTable2007 TH.heading {
	background-image: url(excel-2007-header-left.gif);
	background-repeat: none;
}
`
const SimpleEditor = (props)=>{
    const [editorEnabled, setEditorEnabled] = useState(false);
    const quit=(e)=>{
        if(e.key === 'Enter'){
            setEditorEnabled(false);
        }
    }
    return <If condition={!editorEnabled}>
        <Then>
            <div onClick={()=>{setEditorEnabled(true)}}>
                {props.content||"Untitled"}
            </div>
        </Then>
        <Else>
            <StyledInput>
            <input
                onKeyDown={quit}
                value={props.content}
                onChange={props.onChange}/>
            </StyledInput>

        </Else>
    </If>
}


const ResultTable=(props)=> {

    console.log(props.results);
    const data = (props.results&&props.results.rows||[]).map((r)=>{
        return r.data
    });
    const metadata = (props.results&&props.results.metadata&&props.results.metadata||[]).map((c)=>{
        return c.Name
    })
    //metadata.push({"_":"_"})

    console.log("data = ",data);
    console.log("meta = ",metadata);
    return  <TableStyled className={""}>
        <Table className={`ExcelTable2007`} size={`sm`} hover border>
            <thead>
                <tr>
                    {
                        metadata.map((c)=>{
                            return <th>
                                    {c}
                            </th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
            {
                data.map((r)=>{
                    return <tr>
                        {
                            r.map((v)=>{
                                return <td>{v}</td>
                            })
                        }
                    </tr>
                })
            }

            </tbody>

        </Table>
    </TableStyled>



}

const QueryTool = (props)=>{
    const params= useParams();
    const client = useClient();
    const [isEditorReady, setIsEditorReady] = useState(false);
    const valueGetter = useRef();
    function handleEditorDidMount(_valueGetter) {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
    }
    function handleShowValue() {
        alert(valueGetter.current());
    }
    const [savedQuery,setSavedQuery] = useState({
        label:"",
        description:"",
        sqlBody:"",
    })
    const [ready, setReady] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [envs, setEnvs] = useState({
        count:0,
        pages:1,
        page:1,
        nodes:[]
    })

    const [env, setEnv] = useState({value:'',label:'', region:''});

    const selectEnv= (selectOption)=>{
        setEnv({... selectOption});
    }


    const [queryExecutionResult, setQueryExecutionResult] = useState()

    const fetchEnvironments= async ()=>{
        const response = await client
            .query(listEnvironments({
                filter:{
                    //term :search,
                    page:  envs.page,
                    roles:[],
                    pageSize: envs.pageSize
                }
            }));
        if (!response.errors){
            toast(`Received environments`);
            console.log("Envs = ",response.data.listEnvironments);
            setEnvs(response.data.listEnvironments.nodes.map((e)=>{
                return {
                    label : `${e.label}(${e.AwsAccountId}:${e.region})`,
                    value:e.environmentUri,
                    region:{label:getRegionLabel(e.region),value:e.region}
                }
            }))
        }else {
            toast.error(`Failed to refresh environments, received ${response.errors[0].message}`)
        }
    }

    const updateThisQuery= async()=>{
        const response = await client.mutate(updateSavedQuery({
            queryUri: params.uri,
            input:{
                label : savedQuery.label,
                description : savedQuery.description || "No description",
                tags:["a","b"],
                sqlBody : valueGetter.current()
            }
        }))

        if (!response.errors){
            setSavedQuery(response.data.updateSavedQuery);
            toast("Update Query")
        }else {
            toast(`Could not update saved query, received ${response.errors[0].message}`);
        }

    }

    const executeQuery = async()=>{
        setIsRunning(true);
        const response = await client.query(runSavedQuery({
            savedQueryUri:params.uri,
            environmentUri: env.value,
            sqlBody: valueGetter.current()
        }));

        if (!response.errors){
            setQueryExecutionResult(response.data.runSavedQuery);
            toast("Got data")
        }else {
            toast(`Could not execute query, received ${response.errors[0].message}`);
        }
        setIsRunning(false);

    }
    const fetchQuery= async ()=>{
        const response = await client.query(getSavedQuery(params.uri));
        if (!response.errors){
            setSavedQuery(response.data.getSavedQuery);
        }else {
            toast(`Could not retrieved query, received ${response.errors[0].message}`);
        }
    }


    const fetchItems=async ()=>{
        await fetchQuery();
        fetchEnvironments();
        setReady(true)
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])


    if (!ready){
        return <Container className={`mt-4`} fluid>
            <Row className={`border-top border-bottom mt-3 pt-4 pb-4 `}>
                <Col className={`` } xs={12}>
                    <Spinner variant={`primary`} animation={`border`}/>
                </Col>
            </Row>
        </Container>
    }
    return <Container className={`mt-4`} fluid>
        <Row className={`border-top border-bottom mt-3 pt-4 pb-4 `}>
            <Col className={`` } xs={2}>
                <h3><Icon.Terminal/> Query </h3>
            </Col>
            <Col xs={4}>
                <h3> <SimpleEditor content={savedQuery.label} onChange={(e)=>{setSavedQuery({...savedQuery, label:e.target.value})}}/></h3>
            </Col>

        </Row>
        <Row>
            <Col xs={12}>
                <p> <SimpleEditor
                    content={savedQuery.description||"no description"}
                    onChange={(e)=>{setSavedQuery({...savedQuery, description:e.target.value})}}/></p>
            </Col>
        </Row>

        <Row className={`mt-2`}>
            <Col xs={4}>
                <b>Environment</b>
            </Col>
            <Col xs={1}>

            </Col>
            <Col xs={1}>
                <If condition={isRunning}>
                    <Then>
                        <Spinner variant={`primary`} animation={`border`} size={`sm`}/>
                    </Then>
                </If>
            </Col>
        </Row>
        <Row className={``}>
            <Col xs={4}>
                <Select
                    style={{zIndex:'9999'}}
                    value={env}
                    onChange={selectEnv}
                    options={envs}/>
            </Col>
            <Col xs={2}>
                <If condition={env.label}>
                    <If condition={!isRunning}>
                        <Then>
                            <div onClick={executeQuery} className={`btn btn-secondary btn-sm rounded-pill`}>Run</div>
                        </Then>
                    </If>
                </If>
            </Col>
            <Col xs={2}>
                <div onClick={updateThisQuery} className={`btn btn-primary btn-sm rounded-pill`}>Save</div>
            </Col>
            <Col xs={2}>
                <div className={`btn btn-success btn-sm rounded-pill`}>Share</div>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Row className={`mt-2`}>
                    <Col xs={12}>
                        <Editor value={savedQuery.sqlBody||"select * from T"}
                                options={{minimap:{enabled:false}}}
                                //theme={"hc-black"}
                                inDiffEditor={false}
                                height="19rem"
                                editorDidMount={handleEditorDidMount}
                                language="sql" />
                    </Col>
                </Row>
                <ResizePanel direction="n">
                    <div className="panel sidebar">
                    <Row>
                        <Col className={`mt-2`} fluid xs={12}>
                            <ResultTable results={queryExecutionResult}/>
                        </Col>
                    </Row>
                    </div>
                </ResizePanel>

            </Col>

        </Row>
    </Container>
}


//export default QueryTool;
export default QueryAdmin ;
