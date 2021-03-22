import { gql } from "apollo-boost";

const updateSqlPipeline=({pipelineUri,input})=>{
    return {
        variables:{
            pipelineUri:pipelineUri,
            input  : input
        },
        mutation :gql`mutation UpdateSqlPipeline(
            $input:UpdateSqlPipelineInput,
            $pipelineUri:String!
        ){
            updateSqlPipeline(pipelineUri:$pipelineUri,input:$input){
                sqlPipelineUri
                name
                label
                created
                tags
            }
        }`
    }
}


export default updateSqlPipeline;
