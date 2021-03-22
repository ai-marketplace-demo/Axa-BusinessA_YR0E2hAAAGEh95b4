import {useEffect, useState} from "react";
import * as FeedApi from "../../api/Feed";
import {useParams,useHistory,Link} from "react-router-dom";
import * as ReactIf from "react-if";
import  useClient from "../../api/client";
import * as Defaults from "../../components/defaults";
import {Feed,Icon,Input,Button} from "semantic-ui-react";
import * as Layout from "./styles"

const FeedView = ()=>{
    const client = useClient();
    const params = useParams();
    const history = useHistory();
    const [isSending, setIsSending] = useState(false);
    const [filter, setFilter] = useState({...Defaults.DefaultFilter, pageSize:3});
    const [feed,setFeed] = useState({messages:Defaults.PagedResponseDefault});
    const  [message, setMessage] = useState("");


    const onSend= async(event)=>{
        if(event.key === 'Enter'){
            await post();
        }
    }
    const post = async ()=>{
        setIsSending(true);
        const response = await client.mutate(FeedApi.postFeedMessage({targetType:params.type,targetUri:params.uri,input:{content:message}}));
        if (!response.errors){
            setMessage("")
            setFeed({...feed,messages: {...feed.messages, nodes: [response.data.postFeedMessage].concat(feed.messages.nodes)}})
        }
        setIsSending(false);

    }

    const fetchItems= async ()=>{
        const response = await client.query(FeedApi.listFeedMessages({
            targetUri:params.uri,
            targetType:params.type,
            filter:filter
        }));
        if (!response.errors){
            setFeed({...response.data.getFeed});
        }
    }

    const loadMore = async ()=>{
        const response = await  client.query(FeedApi.listFeedMessages({
            targetUri:params.uri,
            targetType:params.type,
            filter: filter
        }));
        if (!response.errors){
            const newfeed={
                ...feed,
                messages: {
                    ...feed.messages,
                    page : response.data.getFeed.messages.page,
                    pages : response.data.getFeed.messages.pages,
                    hasNext : response.data.getFeed.messages.hasNext,
                    hasPrevious : response.data.getFeed.messages.hasPrevious,
                    nodes:feed.messages.nodes.concat(response.data.getFeed.messages.nodes)
                }
            }
            setFeed({...newfeed})
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client]);

    useEffect(()=>{
        if (client){
            loadMore();
        }
    },[filter.page])

    const redirect=()=>{
        history.goBack();
    }
    return <Layout.FeedLayout>
        <div
        style={{fontSize:"", color:'blue'}}
            onClick={redirect}>
            {`<`} back to {params.type} List
        </div>

        <h1>Messages on {params.type}
            <Link style={{color:'dodgerblue'}}
                  to={`/${params.type.toLowerCase()}/${params.uri}/`}>
                {` `} {feed.target&&feed.target.label}
            </Link>
        </h1>
        <Layout.FeedMessagesLayout>
            <div style={{display:'grid', height:'1rem',columnGap:'1rem',gridTemplateColumns:'1fr 30% 10%'}}>
                <div/>
                <Input onChange={(e)=>{setFilter({...filter,term:e.target.value})}} size={`small`} value={filter.term}/>
                <ReactIf.If condition={feed.messages.hasNext}>
                    <ReactIf.Then>
                        <Button onClick={()=>{setFilter({...filter,page:filter.page+1})}} basic size={`small`} icon labelPosition={`right`}>More<Icon name={`arrow  up`}/></Button>
                    </ReactIf.Then>
                </ReactIf.If>
            </div>
            <ReactIf.If condition={feed.messages.count}>
                <ReactIf.Then>
                    <Feed>
                        {
                            feed.messages.nodes.map((item)=>{
                                return <Feed.Event>
                                    <Feed.Label>
                                        <Layout.Avatar>{item.creator&&item.creator[0]}</Layout.Avatar>
                                    </Feed.Label>
                                    <Feed.Content>
                                        <Feed.Summary>
                                            <Feed.User>{item.creator}</Feed.User>
                                            <Feed.Date>{item.created}</Feed.Date>
                                            <Feed.Meta>{item.feedMessageUri}</Feed.Meta>
                                        </Feed.Summary>
                                        <Feed.Extra text>
                                            {item.content}
                                        </Feed.Extra>
                                        <Feed.Meta>
                                            <Feed.Like>
                                                <Icon name='like' />1 Like
                                            </Feed.Like>
                                        </Feed.Meta>
                                    </Feed.Content>


                                </Feed.Event>
                            }).reverse()
                        }
                    </Feed>

                </ReactIf.Then>
                <ReactIf.Else>
                    <i>No messages published.</i>
                </ReactIf.Else>
            </ReactIf.If>
        </Layout.FeedMessagesLayout>
        <Layout.FeedMessagesFooter>
            <div style={{display:'grid',gridTemplateColumns:'1fr 5rem'}}>
                <Input loading={isSending} onKeyDown={onSend}  value={message} onChange={(e)=>{setMessage(e.target.value)}}/>

            </div>
        </Layout.FeedMessagesFooter>

    </Layout.FeedLayout>
}


export default FeedView;
