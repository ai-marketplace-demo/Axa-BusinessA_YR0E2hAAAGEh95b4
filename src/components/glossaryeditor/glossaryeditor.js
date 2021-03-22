import {useState, useEffect} from "react";
import styled from "styled-components";
import {Button, List, Checkbox, Input} from "semantic-ui-react";
import * as ReactIf from "react-if";
import searchGlossary from "../../api/Glossary/searchGlossary";
import nodesToTree from "../../views/Glossary/components/nodesToTree";
import searchGlossaryHierarchy from "../../api/Glossary/searchGlossaryHierarchy";
import * as Styles from "./styles";
import {listToTree} from "../../views/Glossary/components";
import * as If from "react-if";
import useClient from "../../api/client";


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
    return <div>
        <li>
        {node.label}
        <ReactIf.If condition={node.children&&node.children.length}>
            <ReactIf.Then>
                <ul>
                    {
                        node.children.map((child)=>{
                            return <ResultNode
                                node={child}
                                current={current}
                                setCurrent={setCurrent}
                                link={link}
                                unlink={unlink}

                            />
                        })
                    }
                </ul>
            </ReactIf.Then>
        </ReactIf.If>
    </li>
    </div>
}
const GlossaryEditor=({terms,targetUri, client})=>{
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nodes ,setNodes] = useState([]);

    const fetchItems= async ()=>{
        setLoading(true);
        const response= await client.query(
            searchGlossaryHierarchy({
                    filter:{term:searchTerm},
                    targetUri:targetUri
                }
            )
        )
        const data = response.data.searchGlossaryHierarchy.nodes.map(e=>e);
        const tree=listToTree(
            data,
            {
                idKey:"nodeUri",
                parentKey:"parentUri"
            }
        );
        setMatches(tree);
        setLoading(false);
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])
    return <div style={{width:'1fr'}}>
        <div
            style={{display:"grid", columnGap:'8px',gridTemplateColumns:'repeat(5,auto)'}}>
            {
                terms.map((term)=>{
                    return <Styles.TermStyle>
                        <i>{term}</i><b>X</b>
                    </Styles.TermStyle>
                })
            }
            <div>
                <Button onClick={()=>{setIsEditMode(!isEditMode)}} size={`tiny`}>Add</Button>
            </div>



        </div>
        <div>
            <ReactIf.If condition={isEditMode}>
                <ReactIf.Then>
                    <Styles.GlossarySelect>
                        <Styles.GlossarySelectLayoutHeader>
                            <p><b>Select Term</b></p>
                            <Button size={`tiny`} onClick={()=>{setIsEditMode(false)}} >Close</Button>
                        </Styles.GlossarySelectLayoutHeader>
                        <Styles.GlossarySelectBodyLayout>
                            <Input
                                action={`search`}
                                onChange={(e)=>{setSearchTerm(e.target.value)}}
                                loading={loading}
                                iconPosition='left'
                                onClick={fetchItems}
                                value={searchTerm}
                                placeholder='Search glossary...' >
                            </Input>
                            <div style={{marginLeft:'1rem'}}>
                                {
                                    matches.map((match)=>{
                                        return <ResultNode
                                            link={()=>{}}
                                            unlink={()=>{}}
                                            node={match} current={{}} setCurrent={{}}/>
                                    })
                                }
                            </div>

                        </Styles.GlossarySelectBodyLayout>
                    </Styles.GlossarySelect>
                </ReactIf.Then>
            </ReactIf.If>
        </div>

    </div>
}

export default GlossaryEditor;
