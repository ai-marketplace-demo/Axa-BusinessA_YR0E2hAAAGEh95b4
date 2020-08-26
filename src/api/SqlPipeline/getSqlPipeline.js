import { gql } from "apollo-boost";

const getSqlPipeline= (sqlPipelineUri)=>{
    return {
        variables:{
            sqlPipelineUri:sqlPipelineUri,
        },
        query:gql`
            query GetSqlPipeline($sqlPipelineUri:String!){
                getSqlPipeline(sqlPipelineUri:$sqlPipelineUri){
                    sqlPipelineUri
                    name
                    owner
                    SamlGroupName
                    description
                    label
                    created
                    tags
                    repo
                    cloneUrlHttp
                    environment{
                        environmentUri
                        AwsAccountId
                        region
                    }
                    organization{
                        organizationUri
                        label
                        name
                    }
                    stack{
                        stackUri
                        status
                        stackid
                        link
                        
                    }
                }
            }
        `
    }
}


export default getSqlPipeline ;
