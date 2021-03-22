import {useState,useEffect} from "react";
import useClient from "../../api/client";
import searchGlossary from "../../api/Glossary/searchGlossary";
import PagedResponseDefault from "../defaults/PagedResponseDefault";
import nodesToTree from "../../views/Glossary/components/nodesToTree";
import {List,Input,Label} from "semantic-ui-react";
import * as ReactIf from "react-if";
import * as FiICons from "react-icons/fi"
const GlossarySearchNodeIcon=({node})=>{
    return <ReactIf.Switch>
        <ReactIf.Case condition={node.__typename=="Term"}>
            <FiICons.FiTag/>
        </ReactIf.Case>
        <ReactIf.Case condition={node.__typename=="Category"}>
            <FiICons.FiFolder/>
        </ReactIf.Case>
        <ReactIf.Case condition={node.__typename=="Glossary"}>
            <FiICons.FiBookOpen/>
        </ReactIf.Case>
    </ReactIf.Switch>
}
const GlossarySearchNode=({node,matches,isSelected,toggle})=>{
    const nbmatches=matches.filter((match)=>{return match.key.includes(node.path)}).length;
    const  match=matches.find((match)=>{return match.key===node.path});

    const [displayChildren, setDisplayChildren]= useState(false);
    return <List.Item>
        <div style={{fontSize:'x-small', display:'grid', gridTemplateColumns:'1fr 0.1fr'}} >
            <div onClick={()=>{setDisplayChildren(!displayChildren)}}><GlossarySearchNodeIcon node={node}/>   {node.label}</div>
            <div onClick={()=>{toggle(node)}} style={{fontSize:'x-small',color:'rgba(0,0,0,0.3)'}}>
                <ReactIf.If condition={isSelected(node)}>
                    <ReactIf.Then>
                        <div style={{color:'dodgerblue'}}><b>{nbmatches}</b></div>
                    </ReactIf.Then>
                    <ReactIf.Else>
                        <div>{nbmatches}</div>
                    </ReactIf.Else>
                </ReactIf.If>
            </div>
        </div>
        <ReactIf.If condition={displayChildren&&node.children.length}>
            <ReactIf.Then>
                <List.List>
                    {
                        node.children.map((child)=>{
                            return <GlossarySearchNode toggle={toggle} isSelected={isSelected} matches={matches} node={child}/>
                        })
                    }
                </List.List>
            </ReactIf.Then>
        </ReactIf.If>
    </List.Item>
}
const GlossarySearch =({matches,setQuery})=>{
    const client = useClient();
    const [nodes, setNodes] = useState(PagedResponseDefault);
    const [tree, setTree] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState(matches.map((match)=>{return match.key}));

    const select=(node)=>{
        if (selectedTerms.indexOf(node.path)===-1){
            const terms=[...selectedTerms, node.path]
            setSelectedTerms(terms);

            setQuery({
                query: {
                    terms: {
                        glossary: terms.map(p=>p+"*")
                    },
                },
                value:[node.label]
            });
        }
    }
    const unselect=(node)=>{
        if (selectedTerms.indexOf(node.path)!==-1){
            const terms=selectedTerms.filter(n=>n!==node.path)
            setSelectedTerms(terms);

            setQuery({
                query: {
                    terms: {
                        glossary: terms&&terms.length&&terms.map(p=>p+"*")||""
                    },
                },
                value:terms&&terms.length&&terms.map(p=>p+"*")||""
            });
        }
    }
    const isSelected=(node)=>{
        return selectedTerms.indexOf(node.path)!==-1;
    }

    const toggle=(node)=>{
        if (isSelected(node)){
            unselect(node)
        }else {
            select(node)
        }

    }
    const fetchItems=async ()=>{
        const response =  await client.query(searchGlossary());
        if (!response.errors){
            setNodes(response.data.searchGlossary);
            setTree(nodesToTree(
                response.data.searchGlossary.nodes,
                {
                    idKey:'nodeUri',
                    parentKey:'parentUri'
                }))

        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])
    return <div>
        <div style={{fontSize:'small',color:'rgba(0,0,0,0.5)'}}>
            Glossary
        </div>
        {/**
        <pre>
            {JSON.stringify(selectedTerms,null,4)}
        </pre>**/}
                <List>
                    {
                        tree.map((node)=>{
                            return <GlossarySearchNode
                                toggle={toggle}
                                isSelected={isSelected}
                                matches={matches}
                                node={node}/>

                        })
                    }
                </List>
    </div>
}


export default GlossarySearch;
