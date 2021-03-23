import React, {useEffect,useState} from "react";
import {Button, Icon, Label, Message} from "semantic-ui-react";
import getShareObject from "../../../api/ShareObject/getShareObject";
import removeSharedItem from "../../../api/ShareObject/removeSharedItem";
import submitApproval from "../../../api/ShareObject/submitApproval";
import approveShareObject from "../../../api/ShareObject/approveShareObject";
import rejectShareObject from "../../../api/ShareObject/rejectShareObject";
import {TableContainer} from "../../../components/table";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import {
    Switch, Case, Default
} from 'react-if';
import {Link} from "react-router-dom";

const CurrentPermissions = ({share,client})=>{
    const [loading, setLoading]= useState(false);
    const [error, setError] = useState(null)
    const [sharedItems, setSharedItems] = useState(PagedResponseDefault );
    const [actions, setActions] = useState(null);
    const fetchItems=async ()=>{
        setLoading(true);
        const response = await client.query(getShareObject ({
            shareUri:share.shareUri,
            filter:{
                isShared:true
            }
        }));
        if (!response.errors){
            updateActions();
            setSharedItems({...response.data.getShareObject.items});
        }else {
           setError(``)
        }
        setLoading(false);
    }

    const removeItemFromShareObject=async(item)=>{
        setLoading(true);
        const response= await client.mutate(removeSharedItem ({shareItemUri:item.shareItemUri}));
        if (!response.errors){
            updateActions();
            await fetchItems();
        }else {
            setError({message: response.errors[0].message})
        }
        setLoading(false);
    }
    const updateActions = () => {
        if (share.userRoleForShareObject === 'Approvers') {
            if (share.status === 'PendingApproval') {
                setActions('PendingApproval');
            }
        }
        if (share.userRoleForShareObject === 'Requesters') {
            if (share.status === 'Draft') {
                setActions('Submit');
            }
        }
    }


    const accept = async () => {
        setLoading(true);
        const response = await client
            .mutate(
                approveShareObject({
                    shareUri: share.shareUri,
                })
            );
        if (!response.errors) {
            await fetchItems();
        } else {
            setError({message: response.errors[0].message})
        }
        setLoading(false);
    };

    const reject = async () => {
        setLoading(true);
        const response = await client
            .mutate(
                rejectShareObject({
                    shareUri: share.shareUri,
                })
            );
        if (!response.errors) {
            await fetchItems();
        } else {
            setError({message: response.errors[0].message})
        }
        setLoading(false);
    };


    const submit = async () => {
        const response = await client
            .mutate(
                submitApproval({
                    shareUri: share.shareUri,
                })
            );
        if (!response.errors) {
            setLoading(true);
            await fetchItems();
        } else {
            setError({message: response.errors[0].message})
        }
    };


    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])
    return <div>
        {error && <Message negative>
            <Message.Header>{error && error.header || 'Error'}</Message.Header>
            <p>{error && error.message}</p>
        </Message>
        }
        <Switch>
            <Case condition={actions === 'PendingApproval'}>
                <div>
                    <Button onClick={accept} basic size={'mini'} color={`blue`} content='Approve' icon='checkmark' labelPosition='left'/>
                    <Button onClick={reject} basic size={'mini'} color={`red`} content='Reject' icon='window close' labelPosition='left'/>
                </div>
            </Case>
            <Default>
                <Button onClick={submit} basic size={'mini'} color={`blue`} content='Submit' icon='reply' labelPosition='left'/>
            </Default>
        </Switch>
        <TableContainer
        columns={[{
            label:'itemUri',key:'itemUri',
        },
            {
                label:'Type', key:'itemType'
            },
            {
              label:'Status',
              key:'status'
            },
            {
                label:'Name', key:'itemName'
            },

            {
                label:'Remove',key:'action'
            }
        ]}
        rows={sharedItems.nodes.map((item)=>{
            return {...item, action : <Button
                    icon labelPosition='right'
                    onClick={()=>{removeItemFromShareObject(item)}}
                    size={`mini`}>
                    <Icon name='minus' />
                    Remove
            </Button>}
        })}
        /></div>

}


export default CurrentPermissions;
