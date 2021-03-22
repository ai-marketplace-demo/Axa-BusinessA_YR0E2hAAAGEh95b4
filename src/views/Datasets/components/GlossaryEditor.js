import {useEffect, useState,useRef} from "react";
import * as If from "react-if";
import styled from "styled-components";
import searchGlossaryHierarchy from "../../../api/Glossary/searchGlossaryHierarchy";
import requestLink from "../../../api/Glossary/requestLink";
import useClient from "../../../api/client";
import {listToTree} from "../../Glossary/components"
import {PagedResponseDefault} from "../../../components/defaults";
import {List,Button ,Input,Message,Icon} from "semantic-ui-react";
import GlossaryTreeNode from "../../Glossary/components/GlossaryTreeNode";
const GlossaryEditorLayout = styled.div`
  display: grid ;
  grid-template-rows: auto 1fr;
  grid-template-columns: 0.9fr;
  row-gap: 1rem;
  padding:1rem;
`


const ResultNodeIcon=({node})=>{
    return <If.Switch>
        <If.Case condition={node.__typename=="Term"}>
            <List.Icon name='file outline' />
        </If.Case>
        <If.Case condition={node.__typename=="Category"}>
            <List.Icon name='folder open outline' />
        </If.Case>
        <If.Case condition={node.__typename=="Glossary"}>
            <List.Icon name='bookmark outline' />
        </If.Case>
    </If.Switch>
}

const MatchStyle = styled.div`
color:${props=>props.isMatch?"dodgerblue":""}
`;

const ResultNode=({node,current,setCurrent,link,unlink})=>{

    return <List.Item>
       <ResultNodeIcon node={node}/>
        <List.Content>
            <List.Header>
                <div style={{columnGap:'1rem',display:'grid', gridTemplateColumns:'1fr 0.2fr '}}>
                    <p><MatchStyle isMatch={node.isMatch}>{node.label}</MatchStyle> </p>
                    <If.If condition={node.__typename=="Term"}>
                        <If.Then>
                            <If.If condition={node.assetLink&&node.assetLink.approvedByOwner}>
                                <If.Then>
                                    <If.Then condition={node.assetLink&&node.assetLink.approvedBySteward}>
                                        <Button negative size={`mini`}>
                                            Unlink
                                        </Button>
                                    </If.Then>
                                </If.Then>
                                <If.Else>
                                    <Button onClick={()=>{link(node.nodeUri)}} positive size={`mini`}>
                                        Request Link
                                    </Button>
                                </If.Else>
                            </If.If>

                        </If.Then>
                    </If.If>
                </div>
            </List.Header>
            <List.Description>
                {node.readme}
            </List.Description>
        </List.Content>
        <If.If condition={node.children&&node.children.length}>
            <If.Then>
                {
                    node.children.map((child)=>{
                        return <List>
                            <ResultNode
                                link={link}
                                unlink={unlink}
                                node={child}
                                current={current}
                                setCurrent={setCurrent}/>
                        </List>
                    })
                }
            </If.Then>
        </If.If>
    </List.Item>
}
const GlossaryEditor=({dataset})=>{
    const client = useClient();
    const [message,setMessage] = useState({header:null, content:null,positive:null});
    const [loading,setLoading] = useState(false);
    const [term, setTerm] = useState(null);
    const [matches, setMatches] = useState([]);
    const handleSearchChange=(e)=>{
        setTerm(e.target.value)
    }

    const link = async (nodeUri)=>{
        const response=await client.mutate(requestLink({
            nodeUri:nodeUri,
            targetUri:dataset.datasetUri,
            targetType:'Dataset'
        })) ;
        if (!response.errors){
            setMessage({positive:true, content:'Requested validation ', header:'Success'})
        }else {
            setMessage({positive:false, content:`Could not link item, received ${response.errors[0].message}`, header:'Error'})
        }
    }
    const fetchItems= async ()=>{
        setLoading(true);
        const response= await client.query(
            searchGlossaryHierarchy({
                    filter:{term:term},
                    targetUri:dataset.datasetUri
                    }
                )
        )
        if (!response.errors){
            console.log("==>",response.data.searchGlossaryHierarchy);
            const data = response.data.searchGlossaryHierarchy.nodes.map(e=>e);
            const tree=listToTree(
                data,
                {
                    idKey:"nodeUri",
                    parentKey:"parentUri"
                }
            );
            setMatches(tree);
        }else {

        }
        setLoading(false);
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client, term])


    return <GlossaryEditorLayout>
        <Input
            onChange={handleSearchChange}
            loading={loading}
            value={term}
            label={`term`}
            placeholder='Search glossary...' />
        <div>
            <If.If condition={message.header}>
                <If.Then>
                    <Message positive={message.positive}>
                        <Message.Header>
                            {message.header}
                        </Message.Header>
                        <p>
                            We updated our privacy policy here to better service our customers. We
                            recommend reviewing the changes.
                            <Button
                                secondary
                                onClick={()=>{setMessage({content:null, header:null,positive:null})}}>
                                Close
                            </Button>
                        </p>
                    </Message>
                </If.Then>
            </If.If>
        </div>

        <div>
            <List>
                {
                    matches.map((match)=>{
                        return <ResultNode
                            link={link}
                            unlink={()=>{}}
                            node={match} current={{}} setCurrent={{}}/>
                    })
                }
            </List>
        </div>
    </GlossaryEditorLayout>
}

export default GlossaryEditor;
