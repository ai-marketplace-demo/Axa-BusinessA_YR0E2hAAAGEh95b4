import React from "react";
import {Row,Col,Table} from "react-bootstrap";
import UserProfileLink from "../Profile/UserProfileLink";
import dayjs from "dayjs";
import {AwsRegions as regions} from "../../components/AwsRegions/AwsRegionsData";


const NotebookOverview  =(props)=>{
    return <Row className={`mt-2`}>
        <Col xs={12}>
            <Table  hover size="sm">
                <tbody>

                <tr>
                    <td className={`text-capitalize`}>
                        Name
                    </td>
                    <td>
                        {props.notebook.label}
                    </td>
                </tr>

                <tr scope="row">
                    <td className={`text-capitalize`}>
                        Description
                    </td>
                    <td>
                        <p>{props.notebook.description}</p>
                    </td>
                </tr>
                <tr scope="row">
                    <td className={`text-capitalize`}>
                        Created By
                    </td>
                    <td>
                        <UserProfileLink username={props.notebook.owner}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Created
                    </td>
                    <td>
                        {dayjs(props.notebook.created).fromNow()} ({dayjs(props.notebook.created).format('DD/MMM/YYYY') })
                    </td>
                </tr>
                <tr>
                    <td>
                        Region
                    </td>
                    <td>
                        {regions.find((r)=>{return r.value==props.notebook.environment.region}).label} / ({props.notebook.environment.region})
                    </td>
                </tr>
                </tbody>
            </Table>
        </Col>
    </Row>
};

export default NotebookOverview
