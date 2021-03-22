import {Placeholder, Icon, Table, Button, Loader} from "semantic-ui-react";
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
    return <div style={{display:'grid', placeItems:'start start',gridTemplateColumns:'1fr',gridTemplateRows:'auto 1fr'}}>
        <div style={{
            display:'grid',
            gridTemplateRows:'auto',
            columnGap:'1rem',
            placeItems:'end end',
            gridTemplateColumns:'1fr 1fr '
        }}>
            {pager &&
                <Pager {...pager}/>
            }
            {reload && <div>
                <Button onClick={reload} primary size={`mini`}>
                    Refresh
                </Button>
            </div>}
        </div>
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
