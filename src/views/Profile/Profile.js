import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import {useParams, useHistory} from "react-router-dom";
import useClient from "../../api/client";
import {
    Icon,
    Button,
    Grid,
    Menu,
    Label,
    Segment, Loader, Message
} from "semantic-ui-react";
import {PagedResponseDefault} from "../../components/defaults";
import Pager from "../../components/pager/Pager";
import listNotifications from "../../api/Notification/listNotifications";
import countDeletedNotifications from "../../api/Notification/countDeletedNotifications";
import countReadNotifications from "../../api/Notification/countReadNotifications";
import countUnreadNotifications from "../../api/Notification/countUnreadNotifications";
import markNotificationAsRead from "../../api/Notification/markAsRead";
import archiveNotification from "../../api/Notification/archiveNotification";



const Profile = (props) => {
    const history = useHistory();
    const params = useParams();
    const client = useClient();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState(PagedResponseDefault);
    const [filter, setFilter] = useState({term:'',page:1,pageSize:10});
    let [error, setError] = useState(null);
    const [activeItem, setActiveItem] = useState('inbox');
    const [countInbox, setCountInbox] = useState(null);
    const [countRead, setCountRead] = useState(null);
    const [countArchived, setCountArchived] = useState(null);
    const [actionError, setActionError] = useState(null);

    const handleItemClick = async (e, { name }) => {
        setActiveItem(name);
        if(name==='inbox'){
            await fetchItems({unread:true})
        }
        else if (name==='read'){
            await fetchItems({read:true})
        }
        else if (name==='archived'){
            await fetchItems({archived:true})
        }
    };

    const fetchItems = async (filter)=>{
        setLoading(true);
        const response = await client.query(listNotifications(filter));
        if (!response.errors) {
            setItems(response.data.listNotifications)
            getCountInbox()
            getCountArchived()
            getCountRead()
        }
        else {
            setError({
                header: "Error",
                content: `${response.errors[0].message}`
            })
        }
        setLoading(false);
    }

    const getCountInbox = async ()=>{
        setLoading(true);
        const response = await client.query(countUnreadNotifications());
        if (!response.errors) {
            setCountInbox(response.data.countUnreadNotifications)
        }
        setLoading(false);
    }

    const getCountRead = async ()=>{
        const response = await client.query(countReadNotifications());
        if (!response.errors) {
            setCountRead(response.data.countReadNotifications)
        }
    }

    const getCountArchived = async ()=>{
        const response = await client.query(countDeletedNotifications());
        if (!response.errors) {
            setCountArchived(response.data.countDeletedNotifications)
        }
    }

    const markAsRead = async (notificationUri)=>{
        console.log("notificationuri", notificationUri)
        const response = await client.mutate(markNotificationAsRead({notificationUri}));
        if (!response.errors) {
            fetchItems()
        }
        else{
            setActionError({
                header: "Error",
                content: `${response.errors[0].message}`
            })
        }
    }

    const archive = async (notificationUri)=>{
        const response = await client.mutate(archiveNotification({notificationUri}));
        if (!response.errors) {
            fetchItems()
        }
        else{
            setActionError({
                header: "Error",
                content: `${response.errors[0].message}`
            })
        }
    }

    const signOut = async () => {
        try {
            await Auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };

    useEffect(()=>{
        if (client){
            fetchItems({unread:true});
        }
    },[client]);

    const handlePageChange=(e,{activePage})=>{
        if (activePage<=items.page&&activePage!=items.page){
            setFilter({...filter, page:activePage})
        }
    }
    const pager = {
        count:items.count,
        page:filter.page,
        pages:items.pages,
        loading:!loading,
        onSearch:fetchItems,
        onTermChange:(e)=>{setFilter({...filter, term:e.target.value})},
        onPageChange:handlePageChange
    };

    const actions = <Button icon={'logout'} content={'Signout'} basic color={'blue'} onClick={signOut}/>

    const Messages = () => (
        <div>{actionError && <Message negative onDismiss={()=>{setActionError(null)}}>
            <Message.Header>{actionError.header}</Message.Header>
            <p>{actionError.content}</p>
        </Message>
        }
        </div>
    )
    const messages = <Messages {...actionError}/>
    const titleIcon = <Icon name={'user outline'}/>
    return(<div>
        <ObjectView
            title="Profile"
            icon={titleIcon}
            back={{
                link: '/home',
                label: '< back to home'
            }}
            error={error}
            actions={actions}
            messages={messages}
            tabs={["notifications"]}
        >
            <div>
                <Grid>
                    <Grid.Column width={4}>
                        <Menu vertical size='large' >
                            <Menu.Item
                                name='inbox'
                                active={activeItem === 'inbox'}
                                onClick={handleItemClick}
                            >
                                <Label color={'blue'}>{countInbox}</Label>
                                Inbox
                            </Menu.Item>

                            <Menu.Item
                                name='read'
                                active={activeItem === 'read'}
                                onClick={handleItemClick}
                            >
                                <Label>{countRead}</Label>
                                Read
                            </Menu.Item>

                            <Menu.Item
                                name='archived'
                                active={activeItem === 'archived'}
                                onClick={handleItemClick}
                            >
                                <Label>{countArchived}</Label>
                                Archived
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>

                    <Grid.Column celled width={12}>
                        {loading ? <Loader active={loading}/> :
                        <Segment.Group celled>
                            <Segment><Pager {...pager}/></Segment>
                        {items.nodes.map((item)=>{
                            return (
                                <Segment>
                                    <Grid>
                                        <Grid.Column celled width={14}>
                                            {item.message}
                                        </Grid.Column>
                                        <Grid.Column celled width={2}>
                                            <Button.Group basic size='small'>
                                                <Button icon='eye' onClick={()=>{markAsRead(item.notificationUri)}}/>
                                                <Button icon='archive' onClick={()=>{archive(item.notificationUri)}}/>
                                            </Button.Group>
                                        </Grid.Column>
                                    </Grid>
                                </Segment>
                        )
                        })}</Segment.Group>}
                    </Grid.Column>
                </Grid>
            </div>
        </ObjectView>
    </div>)
}


export default Profile;
