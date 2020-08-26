import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import {If, Then , Else} from "react-if";
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";
import listDatasetTables from "../../../api/Dataset/listDatasetTables";
import getDatasetAdminConsoleUrl from "../../../api/Dataset/getDatasetAdminConsoleUrl";
import syncTables from "../../../api/Dataset/syncTables";
import deleteDatasetStorageLocation from "../../../api/Dataset/removeDatasetStorageLocation";
import TableListItem from "./TableListItem";
import dayjs from "dayjs";
import MainActionButton from "../../../components/MainActionButton/MainButton"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const Styled=styled.div`
height:100vh;
`


const TableList= (props)=>{
    let client = useClient();
    let location = useLocation();
    const required_permissions=[
        'Creator',
        'Admin',
        'ReadWrite'
    ];
    let actionsDisabled= true;
    if (required_permissions.indexOf(props.dataset.userRoleForDataset)!=-1 ){
        actionsDisabled =false;
    }
    let [tables, setTables] = useState({
        count:0,
        nodes:[],
        page:1,
        pages:10,
        hasNext:false,
        hasPrevious:false
    })
    let [redirectUrl, setRedirectUrl] = useState('');
    let [fetchingUrl, setFetchingUrl] = useState(false);

    const redirect=async ()=>{
        setFetchingUrl(true);
        const response= await client.query(getDatasetAdminConsoleUrl(props.dataset.datasetUri));
        if (!response.errors){
            console.log('> > >',response.data.getDatasetAssumeRoleUrl)
            setRedirectUrl(response.data.getDatasetAssumeRoleUrl);

        }else {
            toast.error(`could not retieve url, receiveved ${response.errors[0].message}`)
        }
        setFetchingUrl(false);
    }


    const syncDatasetTables= async()=>{
        const response = await client.mutate(syncTables(props.dataset.datasetUri));
        if (!response.errors){
            toast("Wow, so easy");
            setTables(response.data.syncTables);
        }else {
            toast.warn(`Could not retrieve tables, received ${response.errors[0].message}`);
        }
    }

    useEffect(()=>{
        if (client){
            client
                .query(listDatasetTables({
                    datasetUri:props.dataset.datasetUri,
                    filter:{page:tables.page,pageSize:tables.pageSize}
                }))
                .then((res)=>{
                    if (!res.errors){
                        toast(`Retrieved ${res.data.getDataset.tables.count} tables`, {hideProgressBar:true});
                        setTables({...res.data.getDataset.tables, url:null});

                    }else {
                        toast.error(`Could not retrieve storage locations, received ${res.errors[0].message} `)
                    }
                })
                .catch((err)=>{
                    toast.error(`Unexpected Error ${err.message}`, {hideProgressBar:true})
                })

        }

    },[client])



    const onDelete=async ({locationUri})=>{
        const res = await client.mutate(deleteDatasetStorageLocation({locationUri}));
        if (!res.errors){
            toast(`Deleted table ${locationUri}`,{hideProgressBar:true})
        }else{
            toast.error(`Could not delete table, received ${res.errors[0].message} `)
        }
    }

    const prevPage=()=>{
        if (tables.hasPrevious){
            setTables({...tables, page:tables.page-1})
        }
    }
    const nextPage=()=>{
        if (tables.hasNext){
            setTables({...tables, page:tables.page+1})
        }
    }
    return <Styled>
        <Container>
        <Row>
            <Col xs={2}>
                <h4><Icon.Table size={24}/> Tables </h4>
            </Col>
            <Col xs={4}>
                {(redirectUrl)?(
                    <a target="_blank" href={redirectUrl}>
                        <Icon.Arrow90degRight/> Jump to console</a>
                ):(
                    (fetchingUrl)?(
                        <Spinner size="sm" animation="grow" variant='primary' role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    ):(<div/>)
                )}
            </Col>

            <Col xs={8}>
                {
                    (actionsDisabled)?(
                        <div></div>
                    ):(
                        <Row>
                            <Col xs={6}>
                                <MainActionButton onClick={redirect}>
                                    Manage Tables
                                </MainActionButton>
                            </Col>
                            <Col xs={6}>
                                <Link to={`/dataset/${props.dataset.datasetUri}/newtable`}>
                                    <MainActionButton>
                                        Create
                                    </MainActionButton>

                                </Link>
                            </Col>
                        </Row>
                    )
                }
            </Col>
            <Col xs={2}>
                <If condition={['Creator','Admin'].indexOf(props.dataset.userRoleForDataset)!=-1}>
                    <Then>
                <MainActionButton secondary onClick={syncDatasetTables}>
                    Synchronize
                </MainActionButton>
                    </Then>
                </If>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={4}>
                <i>Found {tables.count} results</i>
            </Col>
            <Col xs={4}>
                <Row>
                    <Col className={`pt-2 text-right`} xs={3}>
                        <Icon.ChevronLeft onClick={prevPage}/>
                    </Col>
                    <Col className={`pt-1 text-center`} xs={3}>
                        {tables.page}/{tables.pages}
                    </Col>
                    <Col className={`pt-2 text-left`} xs={3}>
                        <Icon.ChevronRight onClick={nextPage}/>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row className={`mt-3`}>
            <Col xs={12}>
            {
                (tables.count)?(
                   <table className={"table table-sm"}>
                       <tr>
                           <th>
                               id
                           </th>
                           <th>
                               TableName
                           </th>
                           <th>
                               Created
                           </th>
                           {/**<th>
                               Role
                           </th>**/}
                           <th>
                           </th>
                       </tr>
                       <tbody>
                       {
                           tables.nodes.map((table)=>{
                               return <TableListItem
                                   key={location.locationUri}
                                   table={table}
                                   delete={onDelete}
                                   dataset={props.dataset}
                               />
                           })
                       }
                       </tbody>
                   </table>
                ):(
                    <p><i>No Tables Defined.</i></p>
                )
            }
            </Col>
        </Row>
    </Container>
    </Styled>
}


export default TableList;
