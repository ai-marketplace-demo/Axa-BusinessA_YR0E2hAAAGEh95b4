import {List} from "semantic-ui-react";
import {Case, Else, If, Switch, Then} from "react-if";

const GlossaryTreeNode=({nodeItem,current,setCurrent})=>{
    return <List.Item>
        <Switch>
            <Case condition={nodeItem.__typename=="Glossary"}>
                <List.Icon name={`bookmark outline`}/>
            </Case>
            <Case condition={nodeItem.__typename=="Category"}>
                <List.Icon name={`folder open outline`}/>
            </Case>
            <Case condition={nodeItem.__typename=="Term"}>
                <List.Icon name={`file alternate outline`}/>
            </Case>
        </Switch>
        <List.Content>
            <List.Header onClick={()=>{setCurrent(nodeItem)}}>
                <If condition={nodeItem.nodeUri===current.nodeUri}>
                    <Then>
                        <h5 style={{color:'dodgerblue'}}><b>{nodeItem.label}</b></h5>
                    </Then>
                    <Else>
                        <h5>{nodeItem.label}</h5>
                    </Else>
                </If>
            </List.Header>
            <List.Description>
                {nodeItem.readme}
            </List.Description>
        </List.Content>
        <List.List>
            {
                nodeItem.children&&nodeItem.children.map((child)=>{
                    return <GlossaryTreeNode
                         current={current}
                         setCurrent={setCurrent}
                         nodeItem={child}/>
                })
            }
        </List.List>
    </List.Item>
}

export default GlossaryTreeNode;
