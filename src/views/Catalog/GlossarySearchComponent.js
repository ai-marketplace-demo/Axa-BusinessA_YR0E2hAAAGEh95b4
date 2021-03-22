import {useState, Component,useEffect} from "react";
import {ReactiveComponent,MultiList} from "@appbaseio/reactivesearch";
import useClient from "../../api/client";
import {List,Input} from "semantic-ui-react";
import * as ReactIf from "react-if";
import GlossarySearch from "../../components/glossaryeditor/GlossaryTree";
const pathsToTree = (paths)=>{
    const result = paths.reduce((r, p) => {
        var names = p.split('.');
        names.reduce((q, name) => {
            var temp = q.find(o => o.name === name);
            if (!temp) q.push(temp = { name, children: [] });
            return temp.children;
        }, r);
        return r;
    }, []);
    return result;
}

const GlossarySearchNode=({node})=>{
    return <List.Item>
        <List.Header>
            {node.name}
        </List.Header>
        <ReactIf.If condition={node.children&&node.children.length}>
            <ReactIf.Then>
                <List.List>
                    {
                        node.children.map((child)=>{
                            return <GlossarySearchNode node={child}/>
                        })
                    }
                </List.List>
            </ReactIf.Then>
        </ReactIf.If>

    </List.Item>
}
const GlossarySearchRenderer = ({terms})=>{
    const tree=pathsToTree(terms);
    return <div>
        <input
            placeholder={`Search`}
            style={{
                borderRadius:'5px',
                border:'1px solid lightgrey',
                backgroundColor:'rgba(0,0,0,0.012)',
                fontSize:'small',
                height:'2.1rem',
                textIndent:'12px',
                width:'100%'}}/>
        <div style={{paddingLeft:'12px'}}>
        <List>
        {
            tree.map((node)=>{
                return <GlossarySearchNode node={node}/>
            })
        }
        </List>
        </div>
    </div>

}
const _GlossarySearchComponent= (props)=>{

    return <ReactiveComponent

        innerClass={props.innerClass}
        defaultQuery={()=>{
            return {
                "aggs": {
                    "glossary": {
                        "terms": {
                            "field": "glossary",
                            size: 10,
                        }
                    }
                }
            }
        }}
        render={({ aggregations, setQuery })=>{
            let matches=[]
            if (
                aggregations
                &&aggregations.glossary
                &&aggregations.glossary.buckets.length
            ){
              matches=  aggregations.glossary.buckets;
            }
            const setQueryProxy = ({...data})=>{
                console.log("setQueryProxy <-", data);
                setQuery({...data});
            }
            return <GlossarySearch matches={matches} setQuery={setQueryProxy}/>
        }}
        _render={({ aggregations, setQuery })=>{
            console.log("aggregations = ",aggregations);
            let terms=[];
            if (
                aggregations
                && aggregations.glossaryterms
                && aggregations.glossaryterms.buckets.length
            ){
                terms=aggregations.glossaryterms.buckets.map((b)=>{return b.key});
            }
            return <GlossarySearchRenderer terms={terms}/>

        }}
        componentId={"GlossarySearchComponent"}/>

}



const GlossarySearchComponent=(props)=>{
    console.log(".... GlossarySearchComponent ...")
    return <ReactiveComponent
        componentId="GlossaryPathSensor"
        filterLabel={"Glossary"}
        innerClass={props.innerClass}
        defaultQuery={() => ({
            aggs: {
                'glossary': {
                    terms: {
                        field: 'glossary',
                    },
                },
            },
        })}
        render={({ aggregations, setQuery }) => {
            let matches=[]
            if (
            aggregations
            &&aggregations.glossary
            &&aggregations.glossary.buckets.length
            ){
            matches=  aggregations.glossary.buckets;
        }
            return <GlossarySearch
                matches={matches}
                setQuery={setQuery}
            />
        }}
    />
}

class CustomComponent extends Component {
    constructor(props) {
        console.log("... ??? props = ", props);
        super(props);
    }

    setValue(value) {
        this.props.setQuery({
            query: {
                term: {
                    glossary: value,
                },
            },
            value,
        });
    }
    render() {
        console.log("===>", this.props);
        if (this.props.aggregations) {
            return this.props.aggregations['glossary'].buckets.map(item => (
                <div key={item.key} onClick={() => this.setValue(item.key)}>
                    {item.key}
                </div> // eslint-disable-line
            ));
        }else {
            return <div>nothing</div>
        }

    }
}


export default GlossarySearchComponent;
