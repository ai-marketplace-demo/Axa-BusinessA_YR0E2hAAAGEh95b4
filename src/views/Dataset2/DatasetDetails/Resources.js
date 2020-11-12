import React  ,{useState} from "react";
import {If,Then,Else,Switch, Case,Default} from "react-if";
import {Container,Badge,Row,Col,Table} from "react-bootstrap";
import UserProfileLink from "../../Profile/UserProfileLink";
import Zoom from "../../../components/Zoomer/Zoom";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as Icon from "react-bootstrap-icons";
import StackStatusBadge from "../../../components/StackStatusBadge/StackStatusBadge";
import dayjs from "dayjs";
import EasyEdit, {Types} from "react-easy-edit";
import Creatable from "react-select/creatable/dist/react-select.esm";



const DatasetAwsResources  =(props)=>{
    return <Row className={`mt-2`}>
        <Col xs={12}>
            <Table   hover size="sm">
                <tbody>
                <tr>
                    <td className={`text-capitalize`}>
                        Cloudformation Stack
                    </td>
                    <td>
                        {props.dataset.stack.stackid}
                    </td>
                    <td>
                        <CopyToClipboard text={props.dataset.stack.stackid}>
                            <Icon.Clipboard onClick={()=>{props.copy('Stack Id')}} className={`ml-2`}/>
                        </CopyToClipboard>

                    </td>
                </tr>
                <tr>
                    <td className={`text-capitalize`}>
                        Stack Status
                    </td>
                    <td>
                        <StackStatusBadge status={props.dataset.stack.status}/>
                    </td>
                    <td>
                        -
                    </td>
                </tr>
                <tr>
                    <td className={`text-capitalize`}>
                        S3 Bucket
                    </td>
                    <td>
                        {props.dataset.S3BucketName}
                    </td>
                    <td>
                        <CopyToClipboard text={props.dataset.S3BucketName}>
                            <Icon.Clipboard onClick={()=>{props.copy('S3BucketName')}} className={`ml-2`}/>
                        </CopyToClipboard>
                    </td>
                </tr>

                <tr>
                    <td>
                        S3 Bucket Arn
                    </td>
                    <td>
                        {`arn:aws:s3:::${props.dataset.S3BucketName}`}
                    </td>
                    <td>
                        <CopyToClipboard text={`arn:aws:s3:::${props.dataset.S3BucketName}`}>
                            <Icon.Clipboard onClick={()=>{props.copy('region')}} className={`ml-2`}/>
                        </CopyToClipboard>
                    </td>
                </tr>
                <tr>
                    <td className={`text-capitalized`}>
                        Glue Database Name
                    </td>
                    <td>
                        {props.dataset.GlueDatabaseName}
                    </td>
                    <td>
                        <CopyToClipboard text={props.dataset.GlueDatabaseName}>
                            <Icon.Clipboard onClick={()=>{props.copy('Glue Database Name')}} className={`ml-2`}/>
                        </CopyToClipboard>
                    </td>
                </tr>
                <tr>
                    <td className={`text-capitalized`}>
                        IAM Role
                    </td>
                    <td>
                        {props.dataset.IAMDatasetAdminRoleArn}
                    </td>
                    <td>
                        <CopyToClipboard text={props.dataset.IAMDatasetAdminRoleArn}>
                            <Icon.Clipboard onClick={()=>{props.copy('Iam Role Arn')}} className={`ml-2`}/>
                        </CopyToClipboard>
                    </td>
                </tr>
                </tbody>

            </Table>
        </Col>
    </Row>
}

export default DatasetAwsResources;
