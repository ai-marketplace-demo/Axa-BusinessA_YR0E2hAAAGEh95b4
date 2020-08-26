import React, {useState,useEffect} from "react";
import {If,Then,Else,Switch,Case,Default} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {Row,Col,Container,Badge,Spinner} from "react-bootstrap";
import Select from "react-select";
import {Link, useParams, useHistory, useLocation} from "react-router-dom";
import useClient from "../../../api/client";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const ShareObjectListItem=(props)=>{

    return <tr>

        <td>
            <Switch>
                <Case condition={props.shareObject.principal.principalType=='Organization'}>
                    <p>
                    <Link to={`/organization/${props.shareObject.principal.principalId}/dashboard`}>
                        {props.shareObject.principal.principalName}
                    </Link>
                    </p>
                </Case>
                <Case condition={props.shareObject.principal.principalType=='Project'}>
                    <h5>
                    <Link to={`/project/${props.shareObject.principal.principalId}/contributors`}>
                        <Badge className={`mr-1`} variant={`success`} pill>P</Badge>{props.shareObject.principal.principalName}
                    </Link>
                    </h5>
                </Case>
                <Default>
                    <p>{props.shareObject.principal.principalName}</p>
                </Default>
            </Switch>
        </td>
        <td>
            {props.shareObject.statistics.tables}
        </td>
        <td>
            {props.shareObject.statistics.locations}
        </td>
        <td>{dayjs(props.shareObject.created).fromNow()}</td>
        <td>
            <If condition={props.shareObject.userInitiated}>
                <Then>
                    <p className={`text-danger`}>
                        Requested by {props.shareObject.owner}
                    </p>
                </Then>
                <Else>
                    <p className={`text-black`}>
                        Created by {props.shareObject.owner}
                    </p>

                </Else>
            </If>
        </td>
        <td>
            <If condition={props.shareObject.confirmed&&!props.shareObject.deleted}>
                <Then>
                    <Badge pill variant={`success`}>Active</Badge>
                </Then>
                <Else>
                    <Badge pill variant={`warning`}>Inactive</Badge>

                </Else>
            </If>
        </td>
        <td>
            <Link to={{
                pathname:`/dataset/${props.dataset.datasetUri}/share/${props.shareObject.shareUri}`,
                state:{
                    shareObject : props.shareObject,
                    dataset:props.dataset
                }
            }}>
                view
            </Link>
        </td>

    </tr>




}

export default ShareObjectListItem;
