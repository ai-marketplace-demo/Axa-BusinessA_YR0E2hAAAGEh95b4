import { gql } from "apollo-boost";

const listSqlPipelineBranches= (sqlPipelineUri)=>{
    return {
        variables:{
            sqlPipelineUri:sqlPipelineUri,
        },
        query:gql`
            query ListSqlPipelineBranches($sqlPipelineUri:String!){
                listSqlPipelineBranches(sqlPipelineUri:$sqlPipelineUri)
            }
        `
    }
}


export default listSqlPipelineBranches ;
