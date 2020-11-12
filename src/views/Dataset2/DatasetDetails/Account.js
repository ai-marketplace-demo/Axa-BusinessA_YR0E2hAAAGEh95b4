import React  ,{useState} from "react";
import {If,Then,Else} from "react-if";
import {Container,Row,Col,Table} from "react-bootstrap";
import UserProfileLink from "../../Profile/UserProfileLink";
import Zoom from "../../../components/Zoomer/Zoom";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as Icon from "react-bootstrap-icons";
import dayjs from "dayjs";
import EasyEdit, {Types} from "react-easy-edit";
import Creatable from "react-select/creatable/dist/react-select.esm";


const DatasetAccount  =(props)=>{
    return <Row className={`mt-2`}>
        <Col xs={12}>
            <Table   hover size="sm">
                <tbody>
                    <tr>
                        <td className={`text-capitalize`}>
                            Aws AccountId
                        </td>
                        <td>
                            {props.dataset.AwsAccountId}
                        </td>
                        <td>
                            <CopyToClipboard text={props.dataset.AwsAccountId}>
                                <Icon.Clipboard onClick={()=>{props.copy('AwsAccountId')}} className={`ml-2`}/>
                            </CopyToClipboard>
                        </td>
                    </tr>
                    <tr>
                        <td className={`text-capitalize`}>
                            Region
                        </td>
                        <td>
                            {props.dataset.region}
                        </td>
                        <td>
                            <CopyToClipboard text={props.dataset.region}>
                                <Icon.Clipboard onClick={()=>{props.copy('region')}} className={`ml-2`}/>
                            </CopyToClipboard>
                        </td>
                    </tr>
                </tbody>

            </Table>
        </Col>
    </Row>
}

export default DatasetAccount;
