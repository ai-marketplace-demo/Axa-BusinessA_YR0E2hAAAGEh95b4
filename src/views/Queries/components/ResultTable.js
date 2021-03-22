import {useState, useEffect} from "react";
import { Button,Table,Dropdown, Menu,Icon,Loader ,Message} from 'semantic-ui-react'
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as ReactIf from "react-if";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";

const ResultsTable = ({results,loading})=>{
    if (loading){
        return <Loader active={true}/>
    }
    return <ReactIf.If condition={results&&results.columns}>
            <ReactIf.Then>
                <div
                style={{
                    width:'100%',
                    overflowX:'scroll'
                }}>
                    <Table  compact size='small' celled >
                        <Table.Header>
                            <Table.Row>
                                {
                                    results.columns&&results.columns&&results.columns.map((col)=>{
                                        return <Table.HeaderCell>
                                            {col.columnName}
                                        </Table.HeaderCell>
                                    })
                                }
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                results&&results.rows&&results.rows.map((row)=>{
                                    return <Table.Row>
                                        {
                                            row.cells.map((cell)=>{
                                                return <Table.Cell>
                                                    {cell.value}
                                                </Table.Cell>
                                            })
                                        }
                                    </Table.Row>

                                })
                            }
                        </Table.Body>
                    </Table>
                </div>
            </ReactIf.Then>
        </ReactIf.If>
}


export default ResultsTable;
