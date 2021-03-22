import { gql } from "apollo-boost";

const deleteProjectPipelineNode=(nodeUri)=>{
    return {
        variables:{
            nodeUri : nodeUri
        },
        mutation :gql`mutation DeleteProjectPipelineNode(
            $nodeUri : String!
        ){
            deleteProjectPipelineNode(nodeUri:$nodeUri)
        }`
    }
}


export default deleteProjectPipelineNode;
