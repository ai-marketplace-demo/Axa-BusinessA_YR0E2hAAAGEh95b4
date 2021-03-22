import {useState,useEffect} from "react";
import * as If from "react-if";
import styled from "styled-components";
import * as BsIcons from "react-icons/bs";
import { Dropdown, Menu,Button,Icon } from 'semantic-ui-react'
import GlossaryNodeOverview from "./GlossaryNodeOverview";
import GlossaryNodeAssociations from "./GlossaryTermAssociations";

const GlossaryNodeViewLayout = styled.div`
    display : grid;
    grid-template-rows: auto auto auto 1fr;
    row-gap: 1rem;
`

const GlossaryNodeViewHeader = styled.div`
  width:90%;
    display : grid;
    grid-template-columns: 3fr 1.3fr 1.6fr 1.4fr;
`

const GlossaryTabs = {
    OVERVIEW:'O',
    TERMS:'T'
}

const GlossaryNodeViewTabs=styled.div`
    display: grid;
    column-gap: 1rem;
    grid-template-columns: repeat(4,1fr);
`
const GlossaryNodeViewTab=styled.div`
    color:${props=>props.isCurrent?"dodgerblue":"lightgrey"};
    border-bottom: ${props=>props.isCurrent?"1px solid dodgerblue":""};
`
const GlossaryNodeView = ({node, client,refresh,editable})=>{
    const [tabs,setTabs] = useState();
    const [nodeData,setNodeData] = useState();
    const [activeTab, setActiveTab] = useState(GlossaryTabs.OVERVIEW);

    useEffect(()=>{
        setNodeData(node);
        setActiveTab(GlossaryTabs.OVERVIEW);
    },[node]);

    return <GlossaryNodeViewLayout>
        <GlossaryNodeViewHeader>

            <div style={{fontSize:'larger',fontWeight:'bolder'}}>
                <If.Switch>
                    <If.Case condition={node.__typename=="Term"}>
                        <BsIcons.BsTag/>
                    </If.Case>
                    <If.Case condition={node.__typename=="Category"}>
                        <BsIcons.BsFolder/>
                    </If.Case>
                    <If.Case condition={node.__typename=="Glossary"}>
                        <BsIcons.BsBook/>
                    </If.Case>
                </If.Switch>
                {` ${node.label}`}
            </div>

        </GlossaryNodeViewHeader>
        <h5>{node.readme}</h5>
        <GlossaryNodeViewTabs>
            <GlossaryNodeViewTab onClick={()=>{setActiveTab(GlossaryTabs.OVERVIEW)}} isCurrent={activeTab===GlossaryTabs.OVERVIEW}>
                Overview
            </GlossaryNodeViewTab>
            <GlossaryNodeViewTab onClick={()=>{setActiveTab(GlossaryTabs.TERMS)}} isCurrent={activeTab==GlossaryTabs.TERMS}>
                Linked Terms
            </GlossaryNodeViewTab>
        </GlossaryNodeViewTabs>

        <If.Switch>
            <If.Case condition={activeTab==GlossaryTabs.OVERVIEW}>
                <GlossaryNodeOverview client={client} refresh={refresh} node={node}/>
            </If.Case>
            <If.Case condition={activeTab==GlossaryTabs.TERMS}>
                <GlossaryNodeAssociations client={client} node={node}/>
            </If.Case>
        </If.Switch>
    </GlossaryNodeViewLayout>
}

export default GlossaryNodeView
