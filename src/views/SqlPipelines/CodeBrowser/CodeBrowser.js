import React ,{useEffect,useState} from "react";
import {Col, Row, Container, Form,Spinner,Tabs,Tab} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import {useParams, useHistory} from "react-router";
import * as Icon from  "react-bootstrap-icons";
import styled from "styled-components";
import {Link} from "react-router-dom";
import useClient from "../../../api/client";
import browseSqlPipelineRepository from "../../../api/SqlPipeline/browseSqlPipelineRepository";
import listSqlPipelineBranches from "../../../api/SqlPipeline/listSqlPipelineBranches";
import getSqlPipelineFileContent from "../../../api/SqlPipeline/getSqlPipelineFileContent";
import FileViewer from "./FileViewer";
import {toast} from "react-toastify";
import Select from 'react-select';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)



const CodeBrowser = (props)=>{
    const client = useClient();
    const [prevPath, setPrevPath] = useState("/");
    const [folderPath,setFolderPath]=useState("/")
    const [branches,setBranches]=useState({label:'master',value:'master'})
    const [currentBranch,setCurrentBranch] = useState('master');
    const [loading, setLoading] = useState(true);
    const [isBrowserMode,setIsBrowserMode] = useState(true);
    const [currentViewedFilePath,setCurrentViewedFilePath] = useState(null);
    const [currentViewedFileLanguage,setCurrentViewedFileLanguage] = useState('HTML');
    const [currentFileBody,setCurrentFileBody] = useState("");
    const [nodes,setNodes]=useState([]);
    const fetchBranches= async()=>{
        const bresponse= await client.query(listSqlPipelineBranches(props.sqlPipeline.sqlPipelineUri));
        if (!bresponse.errors){
            setBranches(bresponse.data.listSqlPipelineBranches.map((b)=>{
                return {label : b, value:b}
            }))

        }else {
            toast(`Could not retrieve branches, received ${bresponse.errors[0].message}`)
        }
    }

    const fetchFileContent=async()=>{
        setLoading(true);
        setIsBrowserMode(false);
        const response= await client.query(
            getSqlPipelineFileContent({
                sqlPipelineUri: props.sqlPipeline.sqlPipelineUri,
                branch : currentBranch,
                absolutePath : currentViewedFilePath
            })
        )
        if (!response.errors){
            setCurrentFileBody(response.data.getSqlPipelineFileContent);
        }
    }
    const fetchItems  =async ()=>{
        setLoading(true);
        const fresponse = await client.query(browseSqlPipelineRepository({
            branch : currentBranch,
            sqlPipelineUri : props.sqlPipeline.sqlPipelineUri,
            folderPath : folderPath=="/"?"/":("/"+folderPath)
        }))
        if (!fresponse.errors){
            setNodes(JSON.parse(fresponse.data.browseSqlPipelineRepository));
        }
        setLoading(false);
    }

    const changeBranch=async (opt)=>{
        setCurrentBranch(opt.value);
        await fetchItems();
    }

    const browseFolder = async(absolutePath)=>{
        setPrevPath(folderPath);
        setFolderPath(absolutePath);
    }

    const previewFile= async(absoluteFile)=>{
        setCurrentViewedFilePath(absoluteFile)
        setIsBrowserMode(false);
    }


    useEffect(()=>{
        if (client){
            fetchBranches();
            fetchItems();
            if (!isBrowserMode) {
                fetchFileContent();
            }
        }
    },[client, folderPath,isBrowserMode, currentViewedFilePath])

    return <Container className={`mt-3`}>
        <Row >
            <Col xs={4}>
                <Select
                    defaultValue={{label:currentBranch, value:currentBranch}}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isSearchable={true}
                    name="branch"
                    options={branches}
                    onChange={changeBranch}
                />
            </Col>
            <Col className={`pt-2`} xs={4}>
                <div><h5><b className={`text-primary`}>{props.sqlPipeline.repo}</b> {`   ${folderPath}`}</h5></div>
            </Col>

        </Row>
        <Row className={`mt-3 bg-light`}>
                <If condition={folderPath!="/" && isBrowserMode}>
                    <Col xs={12}>
                        <div onClick={()=>{browseFolder(prevPath)}}>
                            {`..`}
                        </div>
                    </Col>
                </If>
                <Else>
                    {` `}
                </Else>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={12}>
                <If condition={!loading}>
                    <Then>
                        <If condition={isBrowserMode}>
                            <Then>
                                <table className={`table table-hover`}>
                                    {nodes.map((node)=>{
                                        return <tr>
                                            <td>
                                                <div>
                                                    <If condition={node.type=='folder'}>
                                                        <Then>
                                                            <div>
                                                                <Icon.Folder></Icon.Folder>
                                                                <b
                                                                    className={`pl-3`}
                                                                    onClick={()=>{browseFolder(node.absolutePath)}}>
                                                                    {node.relativePath}
                                                                </b>
                                                            </div>
                                                        </Then>
                                                        <Else>
                                                            <div>
                                                                <Icon.FileCode/>
                                                                <b
                                                                    className={`pl-3`}
                                                                    onClick={()=>{previewFile(node.absolutePath)}}
                                                                >
                                                                    {node.relativePath}
                                                                    </b>
                                                            </div>
                                                        </Else>
                                                    </If>
                                                </div>
                                            </td>
                                            <td>
                                                {node.author.email}
                                            </td>
                                            <td>
                                                {node.author.date}
                                            </td>
                                        </tr>
                                    })}
                                </table>
                            </Then>
                            <Else>
                                <FileViewer
                                    close={()=>{setIsBrowserMode(true); setCurrentFileBody("")}}
                                    language={currentViewedFileLanguage}
                                    content={currentFileBody}/>

                            </Else>
                        </If>
                    </Then>
                    <Else>
                        <div className={`mt-1 ml-1`}><Spinner size={`sm`} variant={`info`} animation={`border`}/></div>
                    </Else>
                </If>


            </Col>
        </Row>

    </Container>
}



export default CodeBrowser;
