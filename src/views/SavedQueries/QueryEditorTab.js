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
    const [op, setOp] = useState(false);
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const valueGetter = useRef();

    const [savedQuery, setSavedQuery] = useState(query.queries.count&&query.queries.nodes[0]||null);
    function handleEditorDidMount(_valueGetter) {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
    }

    const executeQuery = async()=>{
        setOp(true);
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
        setOp(false);
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
        setOp(true);
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
        setOp(false);
    }

    const removeThisQuery = async()=>{
        setOp(true);
        const response = await client.mutate(removeSavedQuery(savedQuery.savedQueryUri));
        if (!response.errors){
            toast("Deleted query");
            await setSavedQuery(null);
            await fetchQuery();

        }else {
            toast(`Could not delete query, received ${response.errors[0].message}`)
        }
        setOp(false);
    }

    const moveUp = async ()=>{
        setOp(true);
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
        await  fetchQuery();
        setOp(false);

    }

    const moveDown = async ()=>{
        setOp(true);
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
        await  fetchQuery();
        setOp(false);

    }

    return <Container className={`mt-4`} fluid>
        <Row>


            <Col xs={7}/>
            <Col xs={2}>
                <If condition={op}>
                    <Then>
                        <Spinner variant={`primary`} size={`sm`} animation={`border`}/>
                    </Then>
                </If>
            </Col>

            <Col xs={2}>
                <div onClick={props.createQuery&&props.createQuery} style={{width:'100%'}} className={`btn btn-sm btn-info rounded-pill`}>
                    New
                </div>
            </Col>
        </Row>
        <Row className={`mt-2`}>

            <If condition={!leftPanelCollapsed}>
                <Then>
                    <Col className={`border-right`} xs={3}>
                        <Row>
                            <Col xs={10}></Col>
                            <Col xs={1}>
                                <Icon.ChevronLeft onClick={()=>{setLeftPanelCollapsed(true)}}/>
                            </Col>
                        </Row>
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
                                    <Col xs={12}>
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
                </Then>
                <Else>
                    <Col className={`border-right`} xs={1}>
                        <Icon.ChevronRight onClick={()=>{setLeftPanelCollapsed(false)}}/>
                    </Col>
                </Else>
            </If>

            <Col xs={leftPanelCollapsed?11:9}>
                <Row className={`mt-3 pt-4 border-top `} style={{backgroundColor:''}}>


                    <Col xs={2}>
                        <button type="button" disabled ={op} onClick={updateThisQuery} style={{width:'100%'}} className={`btn btn-sm btn-info rounded-pill`}>
                            Save
                        </button>
                    </Col>
                    <Col xs={2}>
                        <button

                            disabled={op} onClick={executeQuery}
                            style={{width:'100%'}}
                            className={`btn btn-sm btn-success rounded-pill`}>
                            Run
                        </button>
                    </Col>

                    <Col xs={2}>
                        <button
                            data-tip="Remove this query from the workflow"
                            disabled={op} onClick={removeThisQuery} style={{width:'100%'}} className={`btn btn-sm btn-danger rounded-pill`}>
                            Delete
                        </button>
                    </Col>
                    <Col xs={1} className={`border-right`}/>

                    <Col xs={2}>
                        <button disabled={op} type={`button`} onClick={moveUp} style={{width:'100%'}} className={`btn  btn-sm rounded-pill`}>
                            <Icon.ArrowUpCircle/>
                        </button>
                    </Col>
                    <Col xs={2}>
                        <button disabled={op} type={`button`} onClick={moveDown} style={{width:'100%'}} className={`btn btn-sm rounded-pill`}>
                            <Icon.ArrowDownCircle/>
                        </button>
                    </Col>



                </Row>
                <Row className={`mt-3`}>
                </Row>
                <If condition={savedQuery}>
                    <Then>
                        <Row className={`mt-2`}>
                            <Col xs={2}>
                                <b>Label</b>
                            </Col>
                            <Col xs={10}>
                                <input
                                    data-tip="Query Name"
                                    onChange={(e)=>{setSavedQuery({...savedQuery, label:e.target.value})}}
                                    value={savedQuery&&savedQuery.label}
                                    className={`form-control `}/>
                                <ReactTooltip place="right" type="info" effect="solid"/>
                            </Col>
                        </Row>

                        <Row className={`mt-1`}>
                            <Col xs={2}>
                                <b>Description</b>
                            </Col>
                            <Col xs={10}>
                                <input
                                    data-tip="Description of this query"
                                    onChange={(e)=>{setSavedQuery({...savedQuery, description:e.target.value})}}
                                    value={savedQuery&&savedQuery.description}
                                    className={`form-control `}/>
                                <ReactTooltip place="right" type="info" effect="solid"/>
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
