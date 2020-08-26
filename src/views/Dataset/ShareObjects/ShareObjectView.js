import React, {useState,useEffect} from "react";
import * as Icon from "react-bootstrap-icons";
import {Row,Badge,Col,Container,Spinner,Dropdown} from "react-bootstrap";
import  {If,Then, Else,Switch,Case,Default} from "react-if";
import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import {toast} from "react-toastify";
import styled from "styled-components";
import useClient from "../../../api/client";
import dayjs from "dayjs";

import relativeTime from 'dayjs/plugin/relativeTime';
import ShareItemListItem from "./ShareItemListItem";
import MainActionButton from "../../../components/MainActionButton/MainButton";
import getShareObject from "../../../api/ShareObject/getShareObject";
import SharedItemListItem from "./ShareItemListItem.js";
import removeShareItem from "../../../api/ShareObject/removeSharedItem";
import addShareItem  from "../../../api/ShareObject/addSharedItem";
import submitApproval  from "../../../api/ShareObject/submitApproval";
import approveShareObject from "../../../api/ShareObject/approveShareObject";
import rejectShareObject from "../../../api/ShareObject/rejectShareObject";

dayjs.extend(relativeTime)

const Styled=styled.div`
height: 100vh;
`

const ShareObjectView=(props)=>{
    let location = useLocation();
    let params=useParams();
    let client = useClient();
    console.log(params);

    let [search,setSearch] = useState(``);
    let [isLoading, setIsLoading] = useState(false);
    //const shareObject = location.state.shareObject;
    let [shareObject, setShareObject] = useState({
        shareUri:params.shareuri,
        label:'',
        deleted:'',
        confirmed:'',
        userInitiated:'',
        principal:{
            principalId:'',
            principalName:'',
            principalType:''
        },
        items:{
            count:0,
            nodes:[],
            page:1,
            pages:0,
            hasNext:false,
            hasPrevious:false
        }
    })

    const fetchItems=async ()=>{
        const response= await client.query(
            getShareObject({
                shareUri:params.shareuri,
                filter:{
                    page:shareObject.items.page,
                    term :search,
                    isShared:true
                }
            })
        )
        if (!response.errors){
            setShareObject({...response.data.getShareObject})
            setIsLoading(false);
        }else {
            toast.warn(`Could not retrieve  items for share object ${params.shareuri}`)
            setIsLoading(false);
        }
    }

    const handleInputChange=(e=>{setSearch(e.target.value)});

    const handleKeyDown=async (e)=>{
        if (e.key === 'Enter') {
            await fetchItems();
        }
    }

    const nextPage=()=>{
        if (shareObject.items.hasNext){
            setShareObject({...shareObject, items:{...shareObject.items, page:shareObject.items.page+1}})
        }
    }

    const previousPage=()=>{
        if (shareObject.items.hasPrevious){
            setShareObject({...shareObject, items:{...shareObject.items, page:shareObject.items.page-1}})
        }
    }

    const updateSharedItem=async ({itemUri, itemType,permission})=>{
        toast("updateSharedItem called "+`${itemUri}-${itemType}`)
        const response = await client.mutate(addShareItem({
            shareUri : shareObject.shareUri,
            input:{
                itemUri,itemType,permission
            }
        }));
        if (!response.errors){
            toast("Update permission ");
            if (shareObject.items.page==1){
                return fetchItems();
            }
            setShareObject({...shareObject, items:{...shareObject.items, page:1}});
        }else {
            toast.warn(`Could not update item ${itemUri}`)
        }
    }
    const removeItem=async ({shareItemUri})=>{
        const response = await client.mutate(removeShareItem({
            shareItemUri :shareItemUri
        }));
        if (!response.errors){
            return fetchItems();
        }else {
            toast(`Could not add new item to share object, received ${response.errors[0].message}`)
        }
    }

    const approve= async ()=>{
        const response = await client
            .mutate(
                approveShareObject({
                    shareUri:shareObject.shareUri,
                })
            );
        if (!response.errors){
            setIsLoading(true);
            await fetchItems();
        }else {
            toast(`Could not Approve shareObject, received ${response.errors[0].message}`)
        }
    }


    const reject= async ()=>{
        const response = await client
            .mutate(
                rejectShareObject({
                    shareUri:shareObject.shareUri,
                })
            );
        if (!response.errors){
            setIsLoading(true);
            await fetchItems();
        }else {
            toast(`Could not reject shareObject, received ${response.errors[0].message}`)
        }
    }

    const submitShareObjectForApproval=async ()=>{
        const response = await client
            .mutate(
                submitApproval({
                    shareUri:shareObject.shareUri,
                })
            );
        if (!response.errors){
            setIsLoading(true);
            await fetchItems();
        }else {
            toast(`Could not switch State of shareObject, received ${response.errors[0].message}`)
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client,isLoading, shareObject.items.page])

    return <Styled>
        <Container>
        <If condition={isLoading}>
            <Then>
                <Spinner variant={`grow`} animate={`border`}/>
            </Then>
            <Else>

                <Row className={`mt-1`}>
                    <Col xs={1}>
                        <Link
                            style={{color :'black'}}
                            to={{
                                pathname:`/dataset/${props.dataset.datasetUri}/shares`
                            }}>
                            <Icon.ChevronLeft size={32}/>
                        </Link>
                    </Col>
                    <Col xs={9}>
                        <h4>Request Access From </h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}></Col>
                    <Col xs={8}>
                        <Badge pill className={`p-1`} variant={`secondary`}>
                        {shareObject.userRoleForShareObject}
                        </Badge>
                    </Col>

                    <Col xs={4}>Requested By</Col>
                    <Col xs={8}>{shareObject.owner}</Col>

                    <Col xs={4}>Organization</Col>
                    <Col xs={8}>{shareObject.principal.organizationName}</Col>
                    <Col xs={4}>Reader Account</Col>
                    <Col xs={8}>{shareObject.principal.AwsAccountId}</Col>
                    <Col xs={4}>Region</Col>
                    <Col xs={8}>{shareObject.principal.region}</Col>
                    <Col xs={4}>Group</Col>
                    <Col xs={8}>{shareObject.principal.SamlGroupName}</Col>
                    <Col xs={4}>
                        Details
                    </Col>
                    <Col xs={8}>
                        <Link to={`/playground/${shareObject.principal.principalId}`}>
                            link to environment
                        </Link>
                    </Col>
                    <Col xs={4}>
                        Current Status
                    </Col>
                    <Col xs={8}>
                        <Badge pill className={`p-2 mt-2`} variant={`primary`}>{shareObject.status}</Badge>
                    </Col>
                </Row>
                <Switch>
                    <Case condition={shareObject.userRoleForShareObject=='Approvers'}>
                        <If condition={shareObject.status=="PendingApproval"}>
                            <Then>
                                <Row>
                                    <Col xs={6}></Col>
                                    <Col xs={3}>
                                        <MainActionButton onClick={approve}secondary>Approve</MainActionButton>
                                    </Col>
                                    <Col xs={3}>
                                        <MainActionButton onClick={reject}>Reject</MainActionButton>
                                    </Col>
                                </Row>

                            </Then>
                        </If>
                    </Case>
                    <Case condition={['Requesters','DatasetAdmins'].indexOf(shareObject.userRoleForShareObject)!=-1}>
                        <Row>
                            <Col xs={6}></Col>
                            <Col xs={3}>
                                <Link to={{
                                    state:location.state,
                                    pathname:`/dataset/${props.dataset.datasetUri}/share/${shareObject.shareUri}/newitem`
                                }}>
                                    <If condition={shareObject.status!="PendingApproval"}>
                                        <Then>
                                            <MainActionButton secondary>Add Item</MainActionButton>
                                        </Then>
                                    </If>
                                </Link>

                            </Col>
                            <Col xs={3}>
                                <If condition={shareObject.status!="PendingApproval"}>
                                    <Then>
                                        <MainActionButton onClick={submitShareObjectForApproval}>Submit</MainActionButton>
                                    </Then>
                                </If>
                            </Col>
                        </Row>
                    </Case>
                </Switch>

                <Row className={`mt-3`}>
                    <Col xs={10}>
                        <Row className={`mt-3`}>
                            <Col xs={3}><i>Found {shareObject.items.count} results</i></Col>
                            <Col xs={4}/>
                            <Col className={`pt-2 text-right`} xs={1}><Icon.ChevronLeft onClick={previousPage}/></Col>
                            <Col className={`text-center`} xs={2}>Page {shareObject.items.page}/{shareObject.items.pages}</Col>
                            <Col className={`pt-2 text-right`} xs={1}><Icon.ChevronRight onClick={nextPage}/></Col>
                        </Row>
                    </Col>


                    <Col className={`pt-2`} xs={12}>
                        <input
                            className={`form-control`}
                            value={search}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown} style={{width:'100%'}}
                        />
                    </Col>
                    <Col xs={12}>
                        {
                            (isLoading)?(
                                <Spinner size={'sm'} variant={`primary`} animation={`border`}/>
                            ):(
                                (!shareObject.items.count)?(
                                    <p><i>No items in this share object</i></p>
                                ):(
                                    <table className={`table mt-1`}>
                                        <tr>
                                            <th>
                                                Type
                                            </th>
                                            <th>
                                                Name
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                            <th>

                                            </th>
                                        </tr>
                                        <tbody>
                                        {
                                            shareObject.items.nodes.map((sharedItem)=>{
                                                return <SharedItemListItem
                                                    sharedItem={sharedItem}
                                                    dataset={props.dataset}
                                                    removeSharedItem={removeItem}
                                                    updateSharedItem={updateSharedItem}
                                                    key={sharedItem.itemUri}
                                                />
                                            })
                                        }
                                        </tbody>
                                    </table>
                                )
                            )
                        }


                    </Col>
                </Row>
            </Else>
        </If>


    </Container>
    </Styled>




}

export default ShareObjectView;
