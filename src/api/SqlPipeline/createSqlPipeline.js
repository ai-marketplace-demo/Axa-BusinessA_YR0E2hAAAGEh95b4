import { gql } from "apollo-boost";

const createSqlPipeline=({environmentUri ,input})=>{
    return {
        variables:{
            input  : input
        },
        mutation :gql`mutation CreateSqlPipeline(
            $input:NewSqlPipelineInput,
        ){
            createSqlPipeline(input:$input){
                sqlPipelineUri
                name
                label
                created
            }
        }`
    }
}


export default createSqlPipeline;
