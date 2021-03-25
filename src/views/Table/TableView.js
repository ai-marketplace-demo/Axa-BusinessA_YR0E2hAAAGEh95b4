import React, {useState,useEffect} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import getDatasetTable  from "../../api/DatasetTable/getDatasetTable";
import deleteDatasetTable  from "../../api/DatasetTable/deleteDatasetTable";
import useClient from "../../api/client";
import {Button, Header,Message, Modal} from "semantic-ui-react";
import {useParams, useHistory} from "react-router-dom";
import * as ReactIf from "react-if";

const TableView = (props) => {
    const params = useParams();
    const client= useClient();
    const history = useHistory();
    const [table, setTable] = useState({})
    const [error, setError] = useState(null)
    const [actionError, setActionError] = useState(null)
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);
    const fetchItem=async  ()=>{
        const response = await client.query(getDatasetTable(params.uri));
        if (!response.errors){
            console.log(response.data.getDatasetTable);
            setTable({...response.data.getDatasetTable});
        }
        else{
            setError({
                header:"Error",
                content:`Failed to retrieve table ${response.errors[0].message}`
            })
        }
        setLoading(false);
    }

    const deleteTable = async  () => {
        const response = await client.mutate(deleteDatasetTable({tableUri:table.tableUri}));
        if (!response.errors){
            history.push(`/dataset/${table.dataset.datasetUri}/tables`)
        }
        else{
            setActionError({
                header:"Error",
                content:`Failed to delete table ${response.errors[0].message}`
            })
        }
    }

    useEffect(()=> {
        if (client) {
            fetchItem();
        }
    },[client]);
    const isAdmin = () => {
        return ["Creator", "Admin", "Owner"].indexOf(table.dataset.userRoleForDataset) == -1 ? false : true
    }

    const Actions = () => (
        <ReactIf.If condition={true}>
            <ReactIf.Then>
                <div>
                    <Button size='small' basic color={'blue'} onClick={() => setShowDelete(true)}>Delete</Button>
                    <ReactIf.If condition={showDelete}>
                        <ReactIf.Then>
                            <Modal
                                centered={false}
                                onClose={() => setShowDelete(false)}
                                onOpen={() => setShowDelete(true)}
                                open={() => {setShowDelete(true)}}
                                size='small'
                                trigger={<span/>}
                            >
                                <Modal.Content>
                                    <Modal.Description>
                                        <Header>Delete table {table.label} ?</Header>
                                        <p>
                                            Make sure this table is not shared with other users before deletion!
                                        </p>
                                        {actionError && <Message negative>
                                            <Message.Header>{actionError && actionError.header}</Message.Header>
                                            <p>{actionError && actionError.content}</p>
                                        </Message>
                                        }
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color={'grey'} basic onClick={() => setShowDelete(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color={'red'}
                                        content="Confirm"
                                        labelPosition='left'
                                        icon='trash'
                                        onClick={deleteTable}
                                    />
                                </Modal.Actions>
                            </Modal>
                        </ReactIf.Then>
                    </ReactIf.If>
                </div>
            </ReactIf.Then>
        </ReactIf.If>

    );
    const actions = <Actions {...table}/>
    return <ObjectView
        title={table.GlueTableName}
        error={error}
        icon={<BsIcon.BsTable/>}
        loading={loading}
        breadcrumbs={`| dataset/${table.dataset&&table.dataset.name}/table/${table.GlueTableName}`}
        label={"xxx"}
        back={{
            link: `/dataset/${table.datasetUri}/`,
            label: `< back to parent dataset ${table&&table.dataset&&table.dataset.name}`
        }}
        owner={table.owner}
        tabs={["overview","preview", "columns"]}
        actions={actions}
    >
        <Components.Editor client={client}
                           table={{
                               ...table,
                               terms:table.terms&&table.terms.count&&table.terms.nodes||[]
                           }} />
        <Components.TablePreview table={table} client={client}/>
        <Components.TableColumns table={table} client={client}/>
    </ObjectView>
}


export default TableView;
