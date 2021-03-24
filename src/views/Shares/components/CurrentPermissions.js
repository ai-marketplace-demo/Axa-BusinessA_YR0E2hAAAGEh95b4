import React, {useEffect,useState} from "react";
import {Button, Icon, Label, Loader, Message} from "semantic-ui-react";
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


const CurrentPermissions = ({shareUri,client})=>{
    const [loading, setLoading]= useState(false);
    const [share, setShare] = useState(null);
    const [error, setError] = useState(null)
    const [sharedItems, setSharedItems] = useState(PagedResponseDefault );
    const [actions, setActions] = useState(null);
    const fetchItems=async ()=>{
        setLoading(true);
        const response = await client.query(getShareObject ({
            shareUri,
            filter:{
                isShared:true
            }
        }));
        if (!response.errors){
            setSharedItems({...response.data.getShareObject.items});
        }else {
            setError({message: response.errors[0].message})
        }
        setLoading(false);
    }
    const fetchShare= async()=>{
        setLoading(true);
        const response = await client.query(getShareObject({shareUri}));
        if (!response.errors){
            setShare(response.data.getShareObject);
            if (response.data.getShareObject.userRoleForShareObject === 'Approvers') {
                if (response.data.getShareObject.status === 'PendingApproval') {
                    setActions('PendingApproval');
                }
            }
            else if (response.data.getShareObject.userRoleForShareObject === 'Requesters'
                || response.data.getShareObject.userRoleForShareObject === 'DatasetAdmins') {
                if (response.data.getShareObject.status === 'Draft') {
                    setActions('Submit');
                }
            }
            else {
                setActions('Refresh');
            }
        }else {
            setError({
                header: 'Error',
                content: `Could not retrieve share ${shareUri}`
            })
        }
        setLoading(false);
    }

    const removeItemFromShareObject=async(item)=>{
        setLoading(true);
        const response= await client.mutate(removeSharedItem ({shareItemUri:item.shareItemUri}));
        if (!response.errors){
            await fetchShare();
            await fetchItems();
        }else {
            setError({message: response.errors[0].message})
        }
        setLoading(false);
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
            await fetchShare();
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
            await fetchShare();
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
            await fetchShare();
            await fetchItems();
        } else {
            setError({message: response.errors[0].message})
        }
    };

    const setTagColor = () => {
        if (share && share.status === 'Approved')
            return 'green';
        else if (share && share.status === 'Rejected')
            return('red');
        else if (share && share.status === 'PendingApproval')
            return('grey');
        else
            return('black')
    }


    useEffect(()=>{
        if (client){
            fetchShare();
            fetchItems();
        }
    },[client])

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
    return <div>
        {error && <Message negative onDismiss={()=>{setError(null)}}>
            <Message.Header>{error && error.header || 'Error'}</Message.Header>
            <p>{error && error.message}</p>
        </Message>
        }
        <Switch>
            <Case condition={actions === 'PendingApproval'}>
                <div>
                    <Button onClick={fetchShare} basic primary size={`mini`}>
                        Refresh
                    </Button>
                    <Button onClick={accept} basic size={'mini'} color={`blue`} content='Approve' icon='checkmark' labelPosition='left'/>
                    <Button onClick={reject} basic size={'mini'} color={`red`} content='Reject' icon='window close' labelPosition='left'/>
                </div>
            </Case>
            <Case condition={actions === 'Submit'}>
                <div>
                    <Button onClick={fetchShare} basic primary size={`mini`}>
                        Refresh
                    </Button>
                    <Button onClick={submit} basic size={'mini'} color={`blue`} content='Submit' icon='reply' labelPosition='left'/>
                </div>
            </Case>
            <Default>
                <Button onClick={fetchShare} basic primary size={`mini`}>
                    Refresh
                </Button>
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
            return {...item,
                status:<Label tag color={setTagColor()} style={{fontSize:'x-small'}}>{share ? share.status : '-'}</Label>,
                action : <Button
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
