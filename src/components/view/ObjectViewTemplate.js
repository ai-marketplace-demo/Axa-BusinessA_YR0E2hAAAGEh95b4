import React from "react";
import {If,Then,Else,Switch,Case,Default} from "react-if";
import {Tabs} from "../tabs"
import {Link,useParams,useLocation} from "react-router-dom";
import {Grid, Container, Loader, Message, Button, Label} from "semantic-ui-react";
import styled from "styled-components";

const Title= styled.div`
    display: grid;
    padding: 12px;
    place-items: center start ;
    grid-template-columns: auto auto 5fr;
    column-gap: 0.1fr;
`

const ObjectView = ({loading,back,title,breadcrumbs,label,owner,created,icon,tabs,error,actions,messages,status,...props})=>{
    const params=useParams();
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

    return <div
        style={{
            width:'1fr',
            gridTemplateRows:'1fr 2fr 1fr 1fr',
            gridTemplateColumns:'1fr',
            padding:'1rem',
            height:'100%',
            rowGap:'0'}}>
        <div>
            <Link to={back&&back.link}>
                <div style={{fontSize:'smaller',color:'blue'}}>
                    {back&&back.label}
                </div>
            </Link>
        </div>

        <Grid>
            <Grid.Column floated='left' width={9}>
                <Title>
                    <div>{icon}</div>
                    <div style={{fontSize:'x-large'}}>{title}</div>
                    {breadcrumbs && <div style={{fontSize:"smaller", color:'darkgray'}}> {breadcrumbs}</div>}
                    {owner && created && <div style={{fontSize:'xx-small',fontWeight:'bolder',gridColumnStart:1,gridColumnEnd:4}}>
                        {owner} | {created}
                    </div>}

                </Title>
            </Grid.Column>
            {(actions &&
                <Grid.Column floated='right' width={3}>
                    <div style={{marginTop:'10px'}}>{actions}</div>
                </Grid.Column>
            )}
        </Grid>
        {(status &&
            <div style={{marginBottom:'0.25rem'}}>{status}</div>
        )}
        {(messages &&
            <div>{messages}</div>
        )}
        <div>
            <Tabs  current={0} tabs={tabs}/>
        </div>
        <If condition={error}>
            <Then>
                <Message negative>
                    <Message.Header>{error&&error.header || 'Error'}</Message.Header>
                    <p>{error&&error.message}</p>
                    {back && <Link to={back&&back.link}>
                        <div style={{fontSize:'smaller',color:'blue'}}>
                            Back
                        </div>
                    </Link>
                    }
                </Message>
            </Then>
            <Else>
                <div style={{background:'',marginTop:"",width:'1fr', padding:'1rem'}}>
                    <Switch>
                        {
                            tabs&&tabs.length&&tabs.map((tab,position)=>{
                                return <Case condition={tab===params.tab}>
                                    {
                                        React.Children.toArray(props.children)[position]
                                    }
                                </Case>
                            })
                        }
                        <Default>

                            {
                                React.Children.toArray(props.children)[0]
                            }

                        </Default>
                    </Switch>
                </div>
            </Else>
        </If>

    </div>
};


export default ObjectView;
