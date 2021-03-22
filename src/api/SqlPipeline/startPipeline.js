import { gql } from "apollo-boost";

const startDataProcessingPipeline=(sqlPipelineUri)=>{
    return {
        variables:{
            sqlPipelineUri  : sqlPipelineUri
        },
        mutation :gql`mutation StartDataProcessingPipeline(
            $sqlPipelineUri:String!
        ){
            startDataProcessingPipeline(sqlPipelineUri:$sqlPipelineUri)
        }`
    }
}


export default startDataProcessingPipeline;
