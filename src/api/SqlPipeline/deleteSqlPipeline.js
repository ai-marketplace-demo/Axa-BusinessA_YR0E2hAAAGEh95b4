import { gql } from "apollo-boost";

const deleteSqlPipeline=({sqlPipelineUri})=>{
    return {
        variables:{
            sqlPipelineUri:sqlPipelineUri,
        },
        mutation :gql`mutation deleteSqlPipeline($sqlPipelineUri:String!){
            deleteSqlPipeline(sqlPipelineUri:$sqlPipelineUri)
        }`
    }
}


export default deleteSqlPipeline;
