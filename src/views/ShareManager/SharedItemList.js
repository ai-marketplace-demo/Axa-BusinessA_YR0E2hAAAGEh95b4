import React,{useState,useEffect} from "react";
import {Container, Table,Spinner, Row, Col, Tabs,Tab,Badge,Dropdown} from "react-bootstrap";
import {If, Then, Switch, Case, Default,Else} from "react-if";
import {Link} from "react-router-dom";
import * as Icon from "react-bootstrap-icons"
import styled from "styled-components";
import useClient from "../../api/client";
import getShareObject from "../../api/ShareObject/getShareObject";
import SharedItem from "./SharedItem";
import {toast} from "react-toastify";
import removeSharedItem from "../../api/ShareObject/removeSharedItem";
import NextActionDecider from "./NextActionDecider";
import submitApproval from "../../api/ShareObject/submitApproval";
import approveShareObject from "../../api/ShareObject/approveShareObject";
import rejectShareObject from "../../api/ShareObject/rejectShareObject";


const TableStyled = styled.div`
    font-size: 0.9em;
    font-family: Helvetica;
    min-width: 400px;
    
`;



const ShareItemList= (props)=>{
    const client= useClient();
    const [loading, setLoading]= useState(false);
    const [sharedItems, setSharedItems] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious:false,
        nodes:[]
    });

    const fetchShareItems=async ()=>{
        setLoading(true);
        const response = await client.query(getShareObject ({
            shareUri:props.share.shareUri,
            filter:{
                isShared:true
            }
        }));
        if (!response.errors){
            setSharedItems({...response.data.getShareObject.items});
        }else {
            toast(`Could not retrieve details for share, received ${response.errors[0].message}`)
        }
        setLoading(false);
    }

    const removeItemFromShareObject=async(item)=>{
        setLoading(true);
        const response= await client.mutate(removeSharedItem ({shareItemUri:item.shareItemUri}));
        if (!response.errors){
             await fetchShareItems();
             toast(`Removed item`);
        }else {
            toast(`Could not remove item, received ${response.errors[0].message}`);
        }
        setLoading(false);
    }

    const accept=async()=>{
        setLoading(true);
        const response = await client
            .mutate(
                approveShareObject({
                    shareUri:props.share.shareUri,
                })
            );
        if (!response.errors){
            await fetchShareItems();
        }else {
            toast(`Could not Approve shareObject, received ${response.errors[0].message}`)
        }
        setLoading(false);
    }

    const reject=async()=>{
        setLoading(true);
        const response = await client
            .mutate(
                rejectShareObject({
                    shareUri:props.share.shareUri,
                })
            );
        if (!response.errors){
            await fetchShareItems();
        }else {
            toast(`Could not reject shareObject, received ${response.errors[0].message}`)
        }
        setLoading(false);
    }


    const submit =async()=>{
        const response = await client
            .mutate(
                submitApproval({
                    shareUri:props.share.shareUri,
                })
            );
        if (!response.errors){
            setLoading(true);
            await fetchShareItems();
        }else {
            toast(`Could not switch State of shareObject, received ${response.errors[0].message}`)
        }
    }

    useEffect(()=>{
        if (client){
            fetchShareItems();
        }
    },[client]);


    return <Container fluid>
        <Row>
            <If condition={sharedItems.count}>
                <Then>
                    <NextActionDecider
                        accept={accept}
                        reject={reject}
                        submit={submit}
                        share={props.share}/>
                    {/**
                    <If condition={props.share.status=="PendingApproval"&&props.share.userRoleForShareObject=="Approvers"}>
                        <Then>
                            <Col xs={2}>
                                <div className={`rounded-pill btn btn-sm btn-primary`}>
                                    Approve
                                </div>
                            </Col>
                            <Col xs={2}>
                                <div className={`rounded-pill btn btn-sm btn-secondary`}>
                                    Reject
                                </div>
                            </Col>
                        </Then>
                        <Else>
                            <Col xs={4}/>
                        </Else>
                    </If>
                    **/}

                </Then>
                <Else>
                    <Col xs={4}/>
                </Else>
            </If>
            <Col xs={6}></Col>
            <Col xs={1}>
                <If condition={loading}>
                    <Then>
                        <Spinner variant={`secondary`} size={`sm`} animation={`border`}/>
                    </Then>
                </If>
            </Col>
            <Col xs={1}>
                <div onClick={fetchShareItems} className={`btn btn-secondary btn-sm rounded-pill`}>
                    <Icon.ArrowClockwise/>
                </div>
            </Col>
        </Row>
        <If condition={sharedItems.count}>
            <Then>
                <Row>
                <Col className={`mt-3`} xs={12}>
                    <TableStyled>
                        <Table size={`sm`} hover>
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope={"col"}>Status</th>
                            <th scope={"col"}>Action</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            sharedItems.nodes.map((item)=>{
                                return <SharedItem remove={removeItemFromShareObject}item={item}/>
                            })
                        }
                        </tbody>

                    </Table>
                    </TableStyled>
                </Col>
            </Row>
            </Then>
            <Else>
                <Row>
                    <Col xs={12}>
                        <i>No items currently shared</i>
                    </Col>
                </Row>
            </Else>
        </If>

    </Container>
}


export default ShareItemList;
