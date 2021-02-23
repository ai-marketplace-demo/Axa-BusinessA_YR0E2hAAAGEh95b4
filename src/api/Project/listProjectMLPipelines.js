import { gql } from 'apollo-boost';

const listProjectMLPipelines = (projectUri) => ({
    variables: {
        projectUri
    },
    query: gql`
            query listProjectMLPipelines($projectUri:String!){
                listProjectMLPipelines(projectUri:$projectUri){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
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
            }
        `
});


export default listProjectMLPipelines;
