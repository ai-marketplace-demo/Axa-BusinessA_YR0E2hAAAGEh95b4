import { gql } from "apollo-boost";

const getSqlPipelineDag= (sqlPipelineUri)=>{
    return {
        variables:{
            sqlPipelineUri:sqlPipelineUri,
        },
        query:gql`
            query GetSqlPipelineDag($sqlPipelineUri:String!){
                getSqlPipelineDag(sqlPipelineUri:$sqlPipelineUri)
            }
        `
    }
}


export default getSqlPipelineDag ;
