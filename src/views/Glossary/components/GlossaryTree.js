import {useState, useEffect} from "react";
import useClient from "../../../api/client";
import {If,Then,Else,Switch,Case,Default} from "react-if";
import { List,Placeholder ,Table,Segment,Button,Icon} from 'semantic-ui-react'
import listGlossaryTree from "../../../api/Glossary/listGlossaryTree";
import * as defaults from "../../../components/defaults/"
import listToTree from "./nodesToTree";
import GlossaryTreeNode from "./GlossaryTreeNode";
import GlossaryNodeForm from "./GlossaryNodeForm";
import GlossaryTermAssociations from "./GlossaryTermAssociations.js";
import GlossaryNodeView from "./GlossaryNodeView";

const GlossaryTree = ({editable, glossary}) => {
    const client = useClient();
    const [ready, setReady] = useState(false);
    const [items,setItems] = useState(defaults.PagedResponseDefault);
    const [tree, setTree] = useState([]);
    const [viewType, setViewType] = useState("data");
    const [current, setCurrent] = useState(glossary);



    const fetchItems = async ()=>{
        const response = await client.query(listGlossaryTree({nodeUri:glossary.nodeUri}));
        if (!response.errors){
            setItems({...response.data.getGlossary.tree});
            setReady(true);
        }
    }

    const refreshTree=()=>{
        setTree(listToTree(
            items.nodes.map((n)=>{
                return n;
            }),
            {
                idKey:"nodeUri",
                parentKey:"parentUri"
            }
        ));
    }
    const createNewNode = ({nodeType})=>{
        setCurrent({
            _isNew: true,
            __typename:nodeType,
            label: "new node",
            parentUri : current.nodeUri,
            nodeUri:'unknown',
            readme:"new node description"});

    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client]);

    useEffect(()=>{
        refreshTree();
    },[items]);

    return <If condition={ready}>
        <Then>
            <div style={{border:'',display:"grid", columnGap:'3px',gridTemplateColumns:'2fr 6fr'}}>
                <div style={{padding:'1rem'}}>
                 <List>
                    <GlossaryTreeNode
                        setCurrent={setCurrent}
                        current={current}
                        nodeItem={tree[0]}/>
                </List>
                </div>
                <GlossaryNodeView
                    client={client}
                    refresh={fetchItems}
                    node={current} />
            </div>
        </Then>
        <Else>
            <Placeholder>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder>
        </Else>
    </If>




}

export default GlossaryTree;
