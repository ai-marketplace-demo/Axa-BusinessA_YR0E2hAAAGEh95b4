import {Icon, Label, Loader, Message, Table} from 'semantic-ui-react'
import * as ReactIf from "react-if";

const ResultsTable = ({results,loading})=>{
    console.log("Result table received", results);
    if (loading){
        return <Loader active={true}/>
    }
    if(results&&results.Error){
        return <Message negative={true}>
            {results.Error}
        </Message>
    }
    return <ReactIf.If condition={results&&results.columns}>
            <ReactIf.Then>
                <div
                style={{
                    width:'100%',
                    overflowX:'scroll'
                }}>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(2,auto) 1fr'}}>
                        <Label  size={`mini`} icon>
                            <Icon name='hourglass outline' />
                            {`${results&&results.ElapsedTimeInMs}ms`}
                        </Label>
                        <Label  size={`mini`}  icon>
                            <Icon name='file archive outline' />
                            {`${results&&results.DataScannedInBytes} Bytes Scanned`}
                        </Label>
                    </div>
                    <Table  compact size='small' celled >
                        <Table.Header>
                            <Table.Row>
                                {
                                    results&&results.columns&&results.columns&&results.columns.map((col)=>{
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
