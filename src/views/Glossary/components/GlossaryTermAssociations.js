import {useState,useEffect} from "react";
import {Table,Icon,Card} from "semantic-ui-react";
import styled from "styled-components";
import {PagedResponseDefault} from "../../../components/defaults"
import getTerm from "../../../api/Glossary/getTerm";

const GlossaryLinkAssociationsLayout= styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  row-gap: 1rem;
`

const GlossaryLinkAssociationItem = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr;
  column-gap: 1rem;
  padding: 1rem;
  border:  1px lightgrey solid;
  border-radius: 0px;
`

const GlossaryNodeAssociations = ({client, node})=>{
    const [linkedAssets, setLinkedAssets] = useState(PagedResponseDefault);

    const fetchItems= async()=>{
        const response = await client.query(getTerm({nodeUri:node.nodeUri}));
        if (!response.errors){
            setLinkedAssets({...response.data.getTerm.associations});
        }
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[node]);
    return  <div>
        <pre>
            {JSON.stringify(linkedAssets,null,4)}
        </pre>
    </div>
}
export default  GlossaryNodeAssociations;
