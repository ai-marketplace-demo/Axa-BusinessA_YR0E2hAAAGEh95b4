import React, {useState,useEffect} from "react";
import * as Icon from "react-bootstrap-icons";
import {Row,Col,Container,Spinner} from "react-bootstrap";
import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import {toast} from "react-toastify";
import {Select} from "react-select";
import styled from "styled-components";
import useClient from "../../../api/client";
import dayjs from "dayjs";

import relativeTime from 'dayjs/plugin/relativeTime';
import NotSharedItemListItem from "./NotSharedItemListItem";
import getShareObject from "../../../api/ShareObject/getShareObject";
import addShareItem from "../../../api/ShareObject/addSharedItem";
dayjs.extend(relativeTime)


const LeftStyled=styled.div`
height: 30rem;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
border-left:  4px solid lightseagreen;

box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`


const Styled=styled.div`
height: 100vh;
`

const SelectShareItem=(props)=>{
    let location = useLocation();
    let client = useClient();

    const options=[
        {label : 'Read',value:"PartialShare"},
        {label : 'Discover', value:"PartialDiscover"}
    ]

    let [search,setSearch] = useState(``);
    let [isLoading, setIsLoading] = useState(true)
    let [sharedItems, setSharedItems]=useState({
        count:0,
        nodes:[],
        page:1,
        pages:0,
        hasNext:false,
        hasPrevious:false
    });

    const handleInputChange=(e=>{setSearch(e.target.value)});

    const handleKeyDown=async (e)=>{
        if (e.key === 'Enter') {
            await fetchItems();
        }
    }

    const nextPage=()=>{
        if (sharedItems.hasNext){
            setSharedItems({...sharedItems, page:sharedItems.page+1})
        }
    }

    const previousPage=()=>{
        if (sharedItems.hasPrevious){
            setSharedItems({...sharedItems, page:sharedItems.page-1})
        }
    }


    const addNewSharedItem=async ({itemUri, itemType,permission})=>{
        const response = await client.mutate(addShareItem({
            shareUri : location.state.shareObject.shareUri,
            input:{
                itemUri,itemType
            }
        }));
        if (!response.errors){
            toast("Added Share item");
            if (sharedItems.page==1){
                return fetchItems();
            }
            setSharedItems({...sharedItems, page:1});
        }else {
            toast.warn(`Could not add new item to share object ${location.state.shareObject.shareUri}`)
        }
    }
    const fetchItems=async ()=>{
        const response= await client.query(
            getShareObject({
                shareUri:location.state.shareObject.shareUri,
                filter:{
                    page:sharedItems.page,
                    term :search,
                    isShared:false
                }
            })
        )
        if (!response.errors){
            setSharedItems({...response.data.getShareObject.items})
            setIsLoading(false)
        }else {
            toast.warn(`Could not retrieve  items for share object ${location.state.shareObject.shareUri}`)
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, sharedItems.page])

    return <Styled>
        <Container>
        <Row>
            <Col xs={1}>
                <Link
                    style={{color :'black'}}
                    to={{
                        state:{...location.state},
                        pathname:`/dataset/${props.dataset.datasetUri}/share/${location.state.shareObject.shareUri}`
                    }}>
                    <Icon.ChevronLeft size={32}/>
                </Link>
            </Col>
            <Col xs={9}>
                <h4>Select new items </h4>
            </Col>
            <Col className={`mt-1`} xs={2}>

            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Row>
                    <Col xs={4}><i>Found {sharedItems.count} results</i> {JSON.stringify(sharedItems.hasNext)}</Col>
                    <Col xs={8}>
                        <Row>
                            <Col className={`pt-1 text-right`} xs={2}><Icon.ChevronLeft onClick={previousPage}/></Col>
                            <Col className={`text-center`} xs={4}>Page {sharedItems.page}/{sharedItems.pages}</Col>
                            <Col className={`pt-1 text-left`} xs={2}><Icon.ChevronRight onClick={nextPage}/></Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col className={`pt-2`} xs={12}>
                <input className={`form-control`} value={search} name={`search`} onChange={handleInputChange} onKeyDown={handleKeyDown} style={{width:'100%'}}/>
            </Col>
            <Col xs={12}>
                {
                    (isLoading)?(
                        <Spinner size={'sm'} variant={`primary`} animation={`border`}/>
                    ):(
                        (!sharedItems.count)?(
                            <p><i>No more items to add in this share object</i></p>
                        ):(
                            <table className={`mt-1 table `}>
                                <tr>
                                    <th>
                                        Type
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Created
                                    </th>
                                    <th>

                                    </th>
                                </tr>
                                <tbody>
                                {
                                    sharedItems.nodes.map((sharedItem)=>{
                                        return <NotSharedItemListItem
                                            sharedItem={sharedItem}
                                            dataset={props.dataset}
                                            addNewSharedItem={addNewSharedItem}
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


    </Container>
    </Styled>



}

export default SelectShareItem;
