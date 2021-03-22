import { gql } from "apollo-boost";

const createProject=({environmentUri ,input})=>{
    return {
        variables:{
            environmentUri : environmentUri,
            input  : input
        },
        mutation :gql`mutation CreateProject(
            $input:NewProjectInput,
            $environmentUri : String!
        ){
            createProject(environmentUri:$environmentUri,input:$input){
                projectUri
                label
                created
                userRoleInProject
            }
        }`
    }
}


export default createProject;
