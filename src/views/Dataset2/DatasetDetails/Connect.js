import React  ,{useState} from "react";
import {If,Then,Else,Switch, Case,Default} from "react-if";
import {Container,Badge,Row,Col,Table,Spinner} from "react-bootstrap";
import UserProfileLink from "../../Profile/UserProfileLink";
import Zoom from "../../../components/Zoomer/Zoom";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as Icon from "react-bootstrap-icons";
import StackStatusBadge from "../../../components/StackStatusBadge/StackStatusBadge";
import dayjs from "dayjs";
import EasyEdit, {Types} from "react-easy-edit";
import Creatable from "react-select/creatable/dist/react-select.esm";

const DatasetConnect  =(props)=>{
    return <Row className={`mt-2`}>
        <Col xs={12}>
            <Table    size="sm">
                <tr>
                    <th style={{width:'25%'}}></th>
                    <th style={{width:'55%'}}></th>
                </tr>

                <tbody>

                    <tr>
                        <td>
                            <div onClick={()=>{props.generateRedirectUrl()}}  className={`btn btn-sm rounded-pill btn-success`}>
                                Console Access
                            </div>
                        </td>
                        <td>
                            <If condition={props.consoleUrl}>
                                <Then>
                                    <a target={`_blank`} href={props.consoleUrl}>Aws Console </a>
                                </Then>
                                <Else>
                                    <If condition={props.isLoadingConsoleUrl}>
                                        <Then>
                                            <Spinner variant={`primary`} animation={`border`}/>
                                        </Then>
                                        <Else>
                                            <div/>
                                        </Else>
                                    </If>
                                </Else>

                            </If>
                        </td>



                    </tr>
                    <tr>
                        <td>
                            <div  onClick={()=>{props.generateSessionCredentials()}} className={`rounded-pill  btn-sm  btn btn-success`}>
                                Temporary Credentials
                            </div>
                        </td>
                        <td>
                            <If condition={props.credentials}>
                                <Then>
                                    <CopyToClipboard text={props.credentials}>
                                        <Icon.Clipboard onClick={()=>{props.copy('Session Credentials')}} className={`ml-2`}/>
                                    </CopyToClipboard>
                                </Then>
                                <Else>
                                    <If condition={props.isLoadingSessionCredentials}>
                                        <Then>
                                            <Spinner variant={`primary`} animation={`border`}/>
                                        </Then>
                                        <Else>
                                            <div/>
                                        </Else>
                                    </If>
                                </Else>

                            </If>
                        </td>

                    </tr>
                <tr>
                    <td>
                        <div onClick={()=>{props.generateETLCredentials()}} className={`btn-sm rounded-pill  btn btn-info`}>
                             Permanent Credentials
                        </div>
                    </td>
                    <td>
                        <If condition={props.etlCredentials}>
                            <Then>
                                <CopyToClipboard text={props.etlCredentials}>
                                    <Icon.Clipboard onClick={()=>{props.copy('Session Credentials')}} className={`ml-2`}/>
                                </CopyToClipboard>
                            </Then>
                            <Else>
                                <If condition={props.isLoadingETLCredentials}>
                                    <Then>
                                        <Spinner variant={`primary`} animation={`border`}/>
                                    </Then>
                                    <Else>
                                        <div/>
                                    </Else>
                                </If>
                            </Else>

                        </If>
                    </td>


                </tr>

                </tbody>

            </Table>
        </Col>
    </Row>
}

export default DatasetConnect;
