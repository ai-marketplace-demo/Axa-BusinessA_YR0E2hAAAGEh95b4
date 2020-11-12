import React, {useRef, useState} from "react";
import {If, Then, Else} from "react-if";
import {Container, Row, Col,Spinner,Badge} from "react-bootstrap";
import {Case} from "react-if";
import Editor from "@monaco-editor/react";
import * as Icon from "react-bootstrap-icons";
import {toast} from "react-toastify";
import updateSavedQuery from "../../api/SavedQuery/updateSavedQuery";
import removeSavedQuery from "../../api/SavedQuery/removeSavedQuery";
import getScheduledQuery from "../../api/SavedQuery/getScheduledQuery";
import ReactTooltip from 'react-tooltip';
import runSavedQuery from "../../api/SavedQuery/runSavedQuery";
import ResultTable from "./ResultTable";

const QueryEditorTab = (props)=>{
    const [queryExecutionResult, setQueryExecutionResult] = useState();
    const [query ,setQuery]= useState(props.query);
    const client = props.client;
    const [reloading, setReloading] = useState(false);
    const [running, setIsRunning]= useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const valueGetter = useRef();

    const [savedQuery, setSavedQuery] = useState(query.queries.count&&query.queries.nodes[0]||null);
    function handleEditorDidMount(_valueGetter) {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
    }

    const executeQuery = async()=>{
        setIsRunning(true);
        const response = await client.query(runSavedQuery({
            savedQueryUri:savedQuery.savedQueryUri,
            //environmentUri: query.environmentUri,
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

    const fetchQuery = async()=>{
        setReloading(true);
        const response = await client.query(getScheduledQuery(props.query.scheduledQueryUri));
        if (!response.errors){
            setQuery({...response.data.getScheduledQuery});
            console.log("savedQuery == ", savedQuery);
            if (!savedQuery){
                toast(`no saved query ${response.data.getScheduledQuery.queries.count}`);
                if (response.data.getScheduledQuery.queries.count){
                    setSavedQuery(response.data.getScheduledQuery.queries.nodes[0]);
                }
            }
        }else {
            toast(`Could not retrieve query, received ${response.errors[0].message}`)
        }
        setReloading(false);

    }

    const updateThisQuery=async ()=>{
        if (savedQuery){
            const response = await client.mutate(updateSavedQuery({
                queryUri : savedQuery.savedQueryUri,
                input:{
                    sqlBody : valueGetter.current(),
                    label : savedQuery.label,
                    description :savedQuery.description,
                    queryOrder : savedQuery.queryOrder
                }
            }))
            if (!response.errors){
                toast(`Saved Query ${savedQuery.label}`);
                fetchQuery()
            }
        }

    }

    const removeThisQuery = async()=>{
        const response = await client.mutate(removeSavedQuery(savedQuery.savedQueryUri));
        if (!response.errors){
            toast("Deleted query");
            await setSavedQuery(null);
            await fetchQuery();

        }else {
            toast(`Could not delete query, received ${response.errors[0].message}`)
        }

    }

    const moveUp = async ()=>{
        const queryItem = savedQuery;

        setQuery({...query,queries:{...query.queries, nodes:query.queries.nodes.map((q)=>{
                    if (q.savedQueryUri==queryItem.savedQueryUri){
                        return {...queryItem,queryOrder: queryItem.queryOrder-1}
                    }else{
                        return q
                    }
                })}});
        const response = await client.mutate(updateSavedQuery({
            queryUri : queryItem.savedQueryUri,
            input:{
                queryOrder : queryItem.queryOrder-1
            }
        }))
        await  fetchQuery()
    }

    const moveDown = async ()=>{
        const queryItem = savedQuery;

        setQuery({...query,queries:{...query.queries, nodes:query.queries.nodes.map((q)=>{
            if (q.savedQueryUri==queryItem.savedQueryUri){
                return {...queryItem,queryOrder: queryItem.queryOrder+1}
            }else{
                return q
            }
        })}});
        const response = await client.mutate(updateSavedQuery({
            queryUri : queryItem.savedQueryUri,
            input:{
                queryOrder : queryItem.queryOrder+1
            }
        }))
        await  fetchQuery()
    }

    return <Container className={`mt-4`} fluid>
        <Row>
            <Col xs={9}/>

            <Col xs={2}>
                <div onClick={props.createQuery&&props.createQuery} style={{width:'100%'}} className={`btn btn-sm btn-primary rounded-pill`}>
                    New
                </div>
            </Col>
        </Row>
        <Row className={`mt-2`}>

            <Col style={{backgroundColor:''}}  xs={3}>
                <Row>
                    <Col xs={12}>
                        <If condition={reloading}>
                            <Spinner variant={`secondary`} animation={`border`} size={`sm`}/>
                        </If>
                    </Col>
                </Row>
                {((query&&query.queries&&query.queries.nodes)||[]).sort((e1,e2)=>{return e1.queryOrder>e2.queryOrder}).map((queryItem, index)=>{
                    return <Col className={`mt-2`}>
                        <Row key={queryItem.savedQueryUri}>
                            <Col xs={6}>
                                <Icon.FileCode/> <b onClick={()=>{setSavedQuery({...queryItem})}}>{queryItem.label}</b>
                            </Col>
                            {/**
                            <Col xs={1}>
                                <Badge variant={`primary`} pill><small>{queryItem.queryOrder}</small></Badge>
                            </Col>
                             **/}
                        </Row>

                    </Col>
                })}
            </Col>

            <Col xs={9}>
                <Row className={`mt-3 pt-4 border-top `} style={{backgroundColor:''}}>


                    <Col xs={2}>
                        <div onClick={updateThisQuery} style={{width:'100%'}} className={`btn btn-sm btn-info rounded-pill`}>
                            Save
                        </div>
                    </Col>
                    <Col xs={2}>
                        <div onClick={executeQuery} style={{width:'100%'}} className={`btn btn-sm btn-success rounded-pill`}>
                            Run
                        </div>
                    </Col>

                    <Col xs={2}>
                        <div onClick={removeThisQuery} style={{width:'100%'}} className={`btn btn-sm btn-danger rounded-pill`}>
                            Delete
                        </div>
                    </Col>
                    <Col xs={1} className={`border-right`}/>

                    <Col xs={2}>
                        <div style={{width:'100%'}} className={``}>
                            <Icon.XCircle color={`red`} data-tip="Drop Query"/>
                            <ReactTooltip place="right" type="info" effect="solid"/>
                        </div>
                    </Col>

                    <Col xs={1}>
                        <div onClick={moveUp} >
                            <Icon.ArrowUpCircle color={`black`} data-tip="Move query up"/>
                            <ReactTooltip place="right" type="info" effect="solid"/>

                        </div>
                    </Col>



                </Row>
                <Row className={`mt-3`}>
                </Row>
                <If condition={savedQuery}>
                    <Then>
                        <Row className={`mt-2`}>
                            <Col xs={4}>
                                <b>Label</b>
                            </Col>
                            <Col xs={12}>
                                <input
                                    onChange={(e)=>{setSavedQuery({...savedQuery, label:e.target.value})}}
                                    value={savedQuery&&savedQuery.label}
                                    className={`form-control rounded-pill`}/>
                            </Col>
                            <Col xs={4}>
                                <b>Description</b>
                            </Col>
                            <Col xs={12}>
                                <input
                                    onChange={(e)=>{setSavedQuery({...savedQuery, description:e.target.value})}}
                                    value={savedQuery&&savedQuery.description}
                                    className={`form-control rounded-pill`}/>
                            </Col>
                            <Col className={`mt-4`} xs={12}>
                                <If condition={query.queries.count}>
                                    <Then>
                                        <Editor
                                            height="90vh"
                                            options={{
                                                minimap:{enabled:false}
                                            }}
                                            language="sql"
                                            theme={`dark`}
                                            value={savedQuery&&savedQuery.sqlBody}
                                            editorDidMount={handleEditorDidMount}
                                        />
                                    </Then>
                                </If>

                            </Col>
                        </Row>
                    </Then>
                </If>

                <Row className={`mt-4`}>
                    <Col className={`mt-2`} fluid xs={12}>
                        <ResultTable results={queryExecutionResult}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
}


export default QueryEditorTab;
