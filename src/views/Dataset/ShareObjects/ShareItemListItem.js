import React, {useState,useEffect} from "react";
import * as Icon from "react-bootstrap-icons";
import Select from "react-select";
import styled from "styled-components";
import {toast} from "react-toastify";
import {Row,Col,Container,Spinner} from "react-bootstrap";
import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import useClient from "../../../api/client";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const StyledItem = styled.div`
height : 7rem;
border-radius: 8px;
border :1px lightgray solid;
transition: transform 0.2s ease-in-out;
&:hover{
  transform: translateY(-4px);
  box-shadow: 0px 5px 2px lightgrey;

}
`

const SharedItemListItem=(props)=>{
    let options=[
        {
            label : "Visible",
            value:'Visible'
        },
        {
            label : "Shared",
            value:'Shared'

        }]

    let [option,setSelectOption] = useState({
        value:props.sharedItem.permission,
        label:props.sharedItem.permission,
    });

    const updatePermission = async(select)=>{
        await props.updateSharedItem({
            itemUri : props.sharedItem.itemUri,
            itemType : props.sharedItem.itemType,
            permission : select.value
        })
        setSelectOption(select);
    }
    const removeSharedItem=async ()=>{

        await props.removeSharedItem({
            shareItemUri : props.sharedItem.shareItemUri ,
        })
    }
    let ItemIcon = <Icon.Folder/>
    if (props.sharedItem.itemType=="DatasetTable"){
        ItemIcon= <Icon.Table/>
    }

    let bg = "";
    if (props.sharedItem.status=='Rejected'){
        bg=`text-danger`
    }else if (props.sharedItem.status=='PendingApproval'){
        bg=`text-primary bg-light`
    }else if (props.sharedItem.status=='Approved'){
        bg=`text-success`
    }
    return <tr className={bg}>
        <td>{ItemIcon} {props.sharedItem.itemType}</td>
        <td><Link to={`/dataset/${props.dataset.datasetUri}/locations`}>
            {props.sharedItem.itemName||"undefined"}
        </Link>
        </td>
        <td>{props.sharedItem.status}</td>
        {/**<td><Select value={option} onChange={updatePermission} options={options} /></td>**/}
        <td><div onClick={removeSharedItem} className={`btn btn-sm bg-warning `}>Remove</div> </td>
    </tr>

}

const SharedItemListItem2 =(props)=>{
    let options=[
        {
            label : "Discover",
            value:'PartialDiscover'
        },
        {
            label : "Read",
            value:'PartialShare'

        }]

    let [option,setSelectOption] = useState(options[0]);

    const updatePermission = async(select)=>{
        await props.updateSharedItem({
            itemUri : props.sharedItem.itemUri,
            itemType : props.sharedItem.itemType,
            permission : select.value
        })
        setSelectOption(select);
    }
    const removeSharedItem=async ()=>{

        await props.removeSharedItem({
            shareItemUri : props.sharedItem.shareItemUri ,
        })
    }

    return         <StyledItem>
        <Col xs={4}>
            <Row>
                <Col xs={4}>
                    {
                        (props.sharedItem.itemType=='DatasetStorageLocation')?(
                            <Icon.Folder/>
                        ):(
                            <Icon.Table/>
                        )
                    }
                </Col>
                <Col xs={4}>
                    <Link to={`/dataset/${props.dataset.datasetUri}/locations`}>
                        {props.sharedItem.label}
                    </Link>
                </Col>
            </Row>
            <Row c>
                <Col xs={4}>
                    <div onClick={removeSharedItem} className={`btn btn-sm bg-warning `}>Remove</div>
                </Col>

            </Row>
    </Col>
</StyledItem>


}

export default SharedItemListItem;
