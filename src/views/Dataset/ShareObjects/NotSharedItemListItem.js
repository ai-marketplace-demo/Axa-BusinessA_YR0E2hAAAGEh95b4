import React, {useState,useEffect} from "react";
import {If, Then, Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import Select from "react-select";
import {Row,Col,Container,Spinner} from "react-bootstrap";
import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import useClient from "../../../api/client";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const NotSharedItemListItem=(props)=>{
    let options=[
/**        {
            label : "Visible",
            value:'Visible'
        },**/
        {
            label : "Read Only",
            value:'Shared'

        }]

    let [option,setSelectOption] = useState(options[0]);
    const addShareItem=async ()=>{
        await props.addNewSharedItem({
            itemUri : props.sharedItem.itemUri,
            itemType: props.sharedItem.itemType,
            permission : option.value
        })
    }
    return <tr>

        <td>
            <If condition={props.sharedItem.itemType=="Table"}>
                <Then>
                    <Icon.Table/>
                </Then>
                <Else>
                    <Icon.Folder/>
                </Else>
            </If>
        </td>
        <td><Link to={`/dataset/${props.dataset.datasetUri}/locations`}>
            {props.sharedItem.itemName}
        </Link>
        </td>
        <td>{dayjs(props.sharedItem.created).fromNow()}</td>
        {/**<td><Select value={option} onChange={select=>{setSelectOption(select)}} options={options} /></td>**/}
        <td><div onClick={addShareItem} className={`btn btn-sm bg-white border`}>Add</div> </td>
    </tr>




}

export default NotSharedItemListItem
