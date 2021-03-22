import { gql } from "apollo-boost";

const deleteProjectPipeline=(pipelineUri)=>{
    return {
        variables:{
            pipelineUri : pipelineUri
        },
        mutation :gql`mutation DeleteProjectPipeline(
            $pipelineUri : String!
        ){
            deleteProjectPipeline(pipelineUri:$pipelineUri)
        }`
    }
}


export default deleteProjectPipeline;
