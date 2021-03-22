import {useState,useEffect} from "react";
import * as If from "react-if";
import styled from "styled-components";
import * as BsIcons from "react-icons/bs";
import { Dropdown, Statistic,Menu,Button,Icon } from 'semantic-ui-react'
import GlossaryNodeForm from "./GlossaryNodeForm";

const GlossaryNodeOverviewLayout = styled.div`
    display:grid;
    grid-template-rows: auto 1fr;
  row-gap: 1rem;
`;

const GlossaryNodeOverviewActionLayout = styled.div`
    display:grid;
    grid-template-columns:  1fr repeat(3,auto) 0.1fr;
  column-gap: 1rem;
`;

const Modes = {
    DEFAULT : "d",
    EDIT: "e",
    TERMS:"t",
    ADDCAT:'ac',
    ADDTERM:'at'
}

const GlossaryNodeOverview = ({node,client,refresh,isNew})=>{
    const [mode,setMode] = useState(Modes.DEFAULT);

    const enterEdit=()=>{setMode(Modes.EDIT)}
    const enterAddTerm=()=>{setMode(Modes.ADDTERM)}
    const enterAddCategory=()=>{setMode(Modes.ADDCAT)};
    const enterDefault=()=>{setMode(Modes.DEFAULT)};

    useEffect(()=>{
        enterDefault();
    },[node])
    return <GlossaryNodeOverviewLayout>
        <GlossaryNodeOverviewActionLayout>
            <div/>
            <Button onClick={enterEdit} size={`tiny`}>Edit</Button>
            <Button onClick={enterAddCategory} size={`tiny`}>Add Category</Button>
            <Button onClick={enterAddTerm} size={`tiny`}>Add Term</Button>
        </GlossaryNodeOverviewActionLayout>
        <If.Switch>
            <If.Case condition={mode===Modes.DEFAULT}>
                <div style={{
                    placeItems:'start start',
                    display:"grid",
                    gridTemplateColumns:'auto  auto auto 1fr'}}>
                    <Statistic size='small'>
                        <Statistic.Value>
                            <Icon size={`tiny`} name='folder open outline' />
                            {node.stats && node.stats.categories && node.stats.categories||"0"}
                        </Statistic.Value>
                        <Statistic.Label>
                            Categories</Statistic.Label>
                    </Statistic>
                    <Statistic size='small'>
                        <Statistic.Value>
                            <Icon size={`tiny`} name='tag' />
                            {node.stats && node.stats.terms && node.stats.terms||"0"}
                        </Statistic.Value>
                        <Statistic.Label>Terms</Statistic.Label>
                    </Statistic>
                    <Statistic size='small'>
                        <Statistic.Value>
                            <Icon size={`tiny`} name='linkify' />
                            {node.stats && node.stats.associations && node.stats.associations||"0"}
                        </Statistic.Value>
                        <Statistic.Label>Links</Statistic.Label>
                    </Statistic>
                </div>

            </If.Case>
            <If.Case condition={mode===Modes.ADDCAT}>
                <GlossaryNodeForm
                    refresh={refresh}
                    client={client}
                    nodeType={`Category`}
                    cancel={enterDefault}
                    data={{...node,label:"New category", readme:"describe new category" }}
                    isNew={true}/>
            </If.Case>
            <If.Case condition={mode===Modes.ADDTERM}>
                <GlossaryNodeForm
                    refresh={refresh}
                    nodeType={`Term`}
                    client={client}
                    cancel={enterDefault}
                    data={{...node,label:"New term", readme:"describe new term" }}
                    isNew={true}/>
            </If.Case>
            <If.Case condition={mode===Modes.EDIT}>
                <GlossaryNodeForm
                    refresh={refresh}
                    client={client}
                    cancel={enterDefault}
                    data={node}
                    isNew={false}/>
            </If.Case>
        </If.Switch>
    </GlossaryNodeOverviewLayout>
}


export default GlossaryNodeOverview;
