import { gql } from "apollo-boost";

const getSqlPipelineCredsLinux= (sqlPipelineUri)=>{
    return {
        variables:{
            sqlPipelineUri:sqlPipelineUri,
        },
        query:gql`
            query GetSqlPipelineCredsLinux($sqlPipelineUri:String!){
                getSqlPipelineCredsLinux(sqlPipelineUri:$sqlPipelineUri)
            }
        `
    }
}


export default getSqlPipelineCredsLinux ;
