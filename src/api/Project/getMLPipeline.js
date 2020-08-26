import { gql } from "apollo-boost";

const getMLPipeline= (mlPipelineUri)=>{
    return {
        variables:{
            mlPipelineUri:mlPipelineUri
        },
        query:gql`
            query GetMLPipeline($mlPipelineUri:String!){
                getMLPipeline(mlPipelineUri:$mlPipelineUri){
                        mlPipelineUri
                        label
                        name
                        owner
                        description
                        tags
                        created
                        updated
                        jobManagerArn
                        jobManagerName
                        jobManagerStatus
                        statesGeneratorArn
                        statesGeneratorName
                        statesGeneratorStatus
                        workflowManagerName
                        workflowManagerArn
                        workflowManagerStatus
                        cfnStackName
                        cfnStackArn
                        cfnStackStatus
                        codeRepositoryName
                        codeRepositoryLink
                        codeRepositoryStatus
                        codePipelineStatus
                        codePipelineName
                        codePipelineArn
                        securityGroupId
                        packageName
                        subnetId
                        scheduleExpression
                        monitoringEmail
                        status
                    }
                }
        `
    }
}


export default getMLPipeline ;
