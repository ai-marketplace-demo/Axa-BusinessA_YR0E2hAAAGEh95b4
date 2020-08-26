import { gql } from "apollo-boost";

const createProjectMLPipeline=({projectUri ,input})=>{
    return {
        variables:{
            projectUri : projectUri,
            input  : input
        },
        mutation :gql`mutation createProjectMLPipeline(
            $input:NewProjectMLPipelineInput,
            $projectUri : String!
        ){
            createProjectMLPipeline(projectUri:$projectUri,input:$input){
                label
                packageName
                subnetId
                securityGroupId
                scheduleExpression
                monitoringEmail
                subnetId
            }
        }`
    }
}


export default createProjectMLPipeline;
