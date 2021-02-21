import useClient from "../../../api/client";
import React, {useEffect, useState} from "react";
import {If, Then, Else} from "react-if";
import previewTable2 from "../../../api/DatasetTable/previewTable2";
import {toast} from "react-toastify";
import {Container,Col, Row, Spinner,Table} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";


const DatasetTablePreview= (props)=>{
    const client=  useClient();
    const [running, setRunning] = useState(false);
    const [rows, setRows] = useState([]);

    const fetchData=async ()=>{
        setRunning(true);
        const response = await client.query(previewTable2(props.table.tableUri));
        if (!response.errors){
            setRows(response.data.previewTable2.rows);
        }else{
            toast.info(`Could not retrieve preview, received ${response.errors[0].message}`)
        }
        setRunning(false);
    }

    useEffect(()=>{
        if (client){
            fetchData();
        }
    },[client,props.table]);

    return <Container fluid>
        <Row>
            <Col xs={10}></Col>
            <Col xs={1}>
                <If condition={running}>
                    <Then>
                        <Spinner size={`sm`} variant={`secondary`} animation={`border`}/>
                    </Then>
                    <Else>
                        <div/>
                    </Else>
                </If>
            </Col>
            <Col xs={1}>
                <If condition={!running}>
                    <Then>
                        <div onClick={fetchData} className={`btn btn-secondary btn-sm`}>
                            <Icon.ArrowClockwise/>
                        </div>
                    </Then>
                </If>

            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={12}>
                <Table hover size={`sm`}>
                        <tbody>
                        {
                            rows.map((row)=>{
                                return <tr>
                                    {
                                        JSON.parse(row).map((v)=>{
                                            return <td>
                                                {v||"-"}
                                            </td>
                                        })
                                    }
                                </tr>
                            })
                        }
                        </tbody>
                    </Table>

            </Col>

        </Row>
    </Container>
}



export default DatasetTablePreview;
