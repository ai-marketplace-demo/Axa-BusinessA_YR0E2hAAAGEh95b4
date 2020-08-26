import React ,{useState,useEffect} from "react";
import {Container, Table,Row, Badge,Col,Spinner} from "react-bootstrap";
import styled from "styled-components";
import {If,Then,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import Select from 'react-select'
import Tag from "../../../components/Tag/Tag";
import {Link,useParams,useLocation} from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 4px;
background-color: white;
border : 1px solid lightgrey;
padding: 16px;
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 1px 2px 2px whitesmoke;
  
}
`



const OrganizationEnvironmentListItem=(props)=>{
    const location = useLocation();
    const environment = props.environment
    const organization = props.organization ;
    const canEdit = ['Owner','Admin'].indexOf(environment.userRoleInEnvironment)!=-1

    return <tr>
        <td>
            {environment.label}
        </td>
        <td>
            {environment.AwsAccountId}
        </td>
        <td>
            {dayjs(environment.created).fromNow()}
        </td>
        <td>
            {environment.environmentType}
        </td>
        <td className={`text-center`}>
            {environment.validated?"Yes":"Non"}
        </td>
        <td className={`text-center`}>
            <Tag tag={environment.userRoleInEnvironment}/>
        </td>
        <td className={""}>
            <If condition={canEdit}>
                <Then>
                    <Link to={{
                        state:{
                            environment : environment,
                            organization:organization
                        },
                        pathname:`/environment/${environment.environmentUri}/permissions`
                    }}>
                        <div className={"mb-4 btn btn-sm bg-white border"}> Permissions</div>
                    </Link>

                </Then>
            </If>
        </td>
    </tr>
}


export default OrganizationEnvironmentListItem;
