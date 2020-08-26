import { gql } from "apollo-boost";

const deleteProjectMLPipeline=(mlPipelineUri)=>{
    return {
        variables:{
            mlPipelineUri : mlPipelineUri
        },
        mutation :gql`mutation DeleteProjectMLPipeline(
            $mlPipelineUri : String!
        ){
            deleteProjectMLPipeline(mlPipelineUri:$mlPipelineUri)
        }`
    }
}


export default deleteProjectMLPipeline;
