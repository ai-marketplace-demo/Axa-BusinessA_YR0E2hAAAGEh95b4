import React,{useState,useEffect} from "react";
import {Container, Table,Spinner, Row, Col, Tabs,Tab,Badge,Dropdown} from "react-bootstrap";
import {If, Then, Switch, Case, Default,Else} from "react-if";
import {Link} from "react-router-dom";
import * as Icon from "react-bootstrap-icons"
import styled from "styled-components";
import useClient from "../../api/client";
import getShareObject from "../../api/ShareObject/getShareObject";
import addSharedItem  from "../../api/ShareObject/addSharedItem";
import NotSharedItem from "./NotSharedItem";
import {toast} from "react-toastify";


const TableStyled = styled.div`
    font-size: 0.9em;
    font-family: Helvetica;
    min-width: 400px;
    
`;


const NotShareItemList= (props)=>{
    const client= useClient();
    const [loading, setLoading]= useState(false);
    const [term, setTerm] = useState("");
    const [notSharedItems, setNotSharedItems] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext:false,
        hasPrevious : false,
        nodes:[]
    });


    const fetchNotShareItems=async ()=>{
        setLoading(true);
        const response = await client.query(getShareObject ({
            shareUri:props.share.shareUri,
            filter:{
                isShared:false
            }

        }));
        if (!response.errors){
            setNotSharedItems(response.data.getShareObject.items);
        }else {
            toast(`Could not retrieve details for share, received ${response.errors[0].message}`)
        }
        setLoading(false);
    }


    const addItemToShareObject=async (item)=>{
        setLoading(true);
        const response= await client.mutate(addSharedItem({
            shareUri:props.share.shareUri,
            input:{
                itemUri: item.itemUri,
                itemType: item.itemType
            }
        }))
        if (!response.errors){
            await fetchNotShareItems();
        }else {
            toast(`Could not add item, received ${response.errors[0].message}`);
            setLoading(false)
        }
    }
    useEffect(()=>{
        if (client){
            fetchNotShareItems()
        }
    },[client]);


    return <Container fluid>
        <Row>
            <Col xs={2}>

            </Col>
            <Col xs={2}>

            </Col>
            <Col xs={6}></Col>
            <Col xs={1}>
                <If condition={loading}>
                    <Then>
                        <Spinner variant={`info`} size={`sm`} animation={`border`}/>
                    </Then>
                </If>
            </Col>
            <Col xs={1}>
                <div onClick={fetchNotShareItems} className={`btn btn-secondary btn-sm rounded-pill`}>
                    <Icon.ArrowClockwise/>
                </div>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <input className={`form-control rounded-pill`}/>
            </Col>
        </Row>
        <Row>
            <If condition={notSharedItems.count}>
                <Then>
                    <Col className={`mt-3`} xs={12}>
                        <TableStyled>
                            <Table size={`sm`} hover>
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">
                                        Action
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    notSharedItems.nodes.map((item)=>{
                                        return <NotSharedItem share={props.share} add={addItemToShareObject} item={item}/>
                                    })
                                }
                                </tbody>

                            </Table>
                        </TableStyled>
                    </Col>
                </Then>
                <Else>
                    <Col xs={12}>
                        <i>All items were shared</i>
                    </Col>

                </Else>
            </If>

        </Row>
    </Container>
}


export default NotShareItemList;
