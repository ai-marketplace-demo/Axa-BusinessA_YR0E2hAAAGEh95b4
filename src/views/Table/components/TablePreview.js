import React, {useEffect, useState} from "react";
import * as _ from "lodash";
import useClient from "../../../api/client";
import * as ReactIf from "react-if";
import previewTable2 from "../../../api/DatasetTable/previewTable2";
import {Loader,Table } from "semantic-ui-react";

const TablePreview= ({table, client})=>{
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState({rows:[], fields:[]});
    const fetchData=async ()=>{
        setRunning(true);
        const response = await client.query(previewTable2(table.tableUri));
        if (!response.errors){
            setResult(response.data.previewTable2);
        }else{

        }
        setRunning(false);
    }

    useEffect(()=>{
        if (client){
            fetchData();
        }
    },[client]);

    return <ReactIf.If condition={running}>
        <ReactIf.Then>
            <Loader active/>
        </ReactIf.Then>
        <ReactIf.Else>
            <div
                style={{width:'1100px',  overflowX:'scroll'}}>
                <Table
                    compact size={`small`}>
                    <Table.Header>
                        <Table.Row>
                            {
                                result.fields.map((field)=>{
                                    return <Table.HeaderCell>
                                        {JSON.parse(field).name}
                                    </Table.HeaderCell>
                                })
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            result.rows.map((row)=>{
                                return <Table.Row>
                                    {JSON.parse(row).map((cell)=>{
                                        return <Table.Cell>
                                            {cell||""}
                                        </Table.Cell>
                                    })}
                                </Table.Row>
                            })
                        }
                    </Table.Body>
                </Table>
            </div>
        </ReactIf.Else>
    </ReactIf.If>



}

export default TablePreview;
