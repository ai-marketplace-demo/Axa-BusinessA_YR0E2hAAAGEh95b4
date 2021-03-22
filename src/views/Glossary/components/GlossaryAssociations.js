import {useState, useEffect} from "react";
import {Table,Button,Pagination,Message} from "semantic-ui-react";
import Pager from "../../../components/pager/Pager"
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import listGlossaryAssociations from "../../../api/Glossary/listGlossaryAssociations";
import dismissTermAssociation from "../../../api/Glossary/dismissTermAssociation";
import approveTermAssociation from "../../../api/Glossary/approveTermAssociation";

import * as ReactIf from "react-if";
import {Link} from "react-router-dom";
const GlossaryAssociations = ({client, glossary})=>{
    const [items, setItems] = useState(PagedResponseDefault);
    const [message, setMessage] = useState(null);
    const [filter, setFilter] = useState({page:1,pageSize:25, term:''})

    const fetchItems= async ()=>{
        const response = await client.query(listGlossaryAssociations({
            nodeUri:glossary.nodeUri,
            filter:filter
        }));
        if (!response.errors){
            setItems(response.data.getGlossary.associations);
        }else {
            setMessage({
                header:'Failed',
                content: `Could not retrieve associations, received ${response.errors[0].message}`
            })
        }
    }

    const approve=async (item)=>{
        const response = await client.mutate(approveTermAssociation(item.linkUri));
        if (!response.errors){
            fetchItems();
        }else {
            setMessage({
                header:'Failed',
                content:`Could not approved association, received ${response.errors[0].message}`
            })
        }
    }
    const dismiss=async (item)=>{
        const response = await client.mutate(dismissTermAssociation(item.linkUri));
        if (!response.errors){
            await fetchItems();
        }else {
            setMessage({
                header:'Failed',
                content:`Could not approved association, received ${response.errors[0].message}`
            })
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client]);

    const next=()=>{
        if (items.hasNext){
            setFilter({...filter,page:items.page+1})
            fetchItems()
        }
    }
    const previous=()=>{
        if (items.hasPrevious){
            setFilter({...filter,page:items.page-1});
            fetchItems()
        }
    }

    return         <div>
        <div style={{placeItems:'center start',display:'grid', gridTemplateColumns:'9fr 1fr'}}>
            <Pager
                refresh={fetchItems}
                value={filter.term}
                page={items.page}
                label={`associations`}
                pages={items.pages}
                onChange={(e)=>{setFilter({...filter,term:e.target.value})}}
            />
            <Button style={{height:'2rem'}} onClick={fetchItems} size={`mini`} primary>Refresh</Button>
        </div>
        <ReactIf.If condition={message}>
            <ReactIf.Then>
                <Message negative>
                    <Message.Header>
                        {message&&message.header}
                    </Message.Header>
                    <p>
                        {message&&message.content}
                    </p>
                    <Message.Content>
                        <Button onClick={()=>{setMessage(null)}}>Close</Button>
                    </Message.Content>
                </Message>
            </ReactIf.Then>
        </ReactIf.If>

        <Table striped compact={true}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        Term
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Target Type
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Target Name
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Approval
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    items.nodes.map((item)=>{
                        return <Table.Row>
                            <Table.Cell>
                                {item.term.label}
                            </Table.Cell>
                            <Table.Cell>
                                {item.target.__typename}
                            </Table.Cell>
                            <Table.Cell>
                                <ReactIf.Switch>
                                    <ReactIf.Case condition={item.target.__typename==`Dataset`}>
                                        <Link to={`/dataset/${item.targetUri}`}>{item.target.label}</Link>
                                    </ReactIf.Case>
                                    <ReactIf.Case condition={item.target.__typename==`DatasetTable`}>
                                        <Link to={`/tabble/${item.targetUri}`}>{item.target.label}</Link>
                                    </ReactIf.Case>
                                </ReactIf.Switch>
                            </Table.Cell>
                            <Table.Cell>
                                <ReactIf.If condition={item.approvedBySteward}>
                                    <ReactIf.Then>
                                        <Button onClick={()=>{dismiss(item)}}size={`mini`} negative>
                                            Dismiss
                                        </Button>
                                    </ReactIf.Then>
                                    <ReactIf.Else>
                                        <Button onClick={()=>{approve(item)}} positive size={`mini`}>
                                            Accept
                                        </Button>
                                    </ReactIf.Else>
                                </ReactIf.If>
                            </Table.Cell>

                        </Table.Row>
                    })
                }
            </Table.Body>
        </Table>
    </div>
}

export default GlossaryAssociations;
