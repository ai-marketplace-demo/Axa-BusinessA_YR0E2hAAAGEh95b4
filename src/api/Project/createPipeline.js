import { gql } from "apollo-boost";

const createProjectPipeline=({projectUri ,input})=>{
    return {
        variables:{
            projectUri : projectUri,
            input  : input
        },
        mutation :gql`mutation CreateProjectPipeline(
            $input:NewProjectPipelineInput,
            $projectUri : String!
        ){
            createProjectPipeline(projectUri:$projectUri,input:$input){
                pipelineUri
                label
                description
                created
                owner
            }
        }`
    }
}


export default createProjectPipeline;
