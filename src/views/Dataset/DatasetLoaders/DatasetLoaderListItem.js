import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import {toast} from 'react-toastify';

import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



const DatasetLoaderListItem= (props)=>{
    const loader = props.loader;
    let canChange= true;
    if (['Owner','Admin','ReadWrite'].indexOf(props.dataset.userRoleForDataset)==-1){
        canChange=false;
    }



    const remove= async ()=>{
        await props.removeLoader({loaderUri:props.loader.loaderUri})
    }
    return <tr>
        <td>{loader.IAMPrincipalArn}</td>
        <td>{loader.label}</td>
        <td>{dayjs(loader.created).fromNow()}</td>
        <td>
            {
                (canChange)?(
                    <div onClick={remove} className={"btn-sm btn btn-warning"}>Remove</div>

                ):(
                    <div></div>
                )

            }
        </td>
    </tr>

}


export default DatasetLoaderListItem;
