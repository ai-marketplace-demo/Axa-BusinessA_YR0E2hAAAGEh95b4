import {Placeholder, Icon, Table, Button, Loader, Grid, GridColumn} from "semantic-ui-react";
import styled from "styled-components";
import {If,Then,Else} from "react-if";
import Pager from "../../components/pager/Pager"
import React from "react";


const TableContainer=({columns,rows,loading,reload,pager})=>{
    const color=`blue`;
    if (loading){
        return <div
            style={{
                width:'1fr',
                display:'block',
                height:'100%'
            }}
        >
            <Loader active/>
        </div>
    }
    const reloadMargin = pager ? '32px' : '0px'
    return <div>
        {(pager || reload) && <Grid>
            {pager &&
            <Grid.Column floated='left' width={12}>
                <Pager {...pager}/>
            </Grid.Column>
            }
            {reload &&
            <Grid.Column floated='left' width={4}>
                <div style={{marginTop: reloadMargin}}>
                    <Button onClick={reload} primary size={`mini`}>
                        Refresh
                    </Button>
                </div>
            </Grid.Column>
            }
        </Grid>
        }
        <If condition={rows && rows.length > 0}>
            <Then>
                <Table basic compact color={color} key={color}>
                    <Table.Header>
                        <Table.Row>
                    {
                        columns.map((c)=>{
                            return <Table.HeaderCell {...c}>
                                {c.label || '-'}
                            </Table.HeaderCell>
                        })
                    }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <If condition={loading}>
                            <Then>
                                {
                                    ["1","2","3","4"].map(()=>{
                                        return <Table.Row>
                                                {
                                                    columns.map((col)=>{
                                                        return <Table.Cell>
                                                            <Placeholder>
                                                                <Placeholder.Line />
                                                            </Placeholder>
                                                        </Table.Cell>
                                                    })
                                                }
                                        </Table.Row>
                                    })
                                }

                            </Then>
                            <Else>

                            </Else>
                        </If>

                        {
                            rows.map((row)=>{
                                return <Table.Row>
                                    {
                                        columns.map((col)=>{
                                            return <Table.Cell>
                                                {row[col.key]}
                                            </Table.Cell>
                                        })
                                    }
                                </Table.Row>
                            })
                        }
                    </Table.Body>

                </Table>
            </Then>
        </If>
    </div>
}


export default TableContainer;
