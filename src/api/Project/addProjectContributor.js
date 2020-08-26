import { gql } from "apollo-boost";

const addProjectContributor=({userName, projectUri, role})=>{
    return {
        variables:{userName,projectUri,role},
        mutation :gql`mutation AddProjectContributor(
            $projectUri:String,
            $userName:String,
            $role:ProjectMemberRole
        ){
            addProjectContributor(
                projectUri:$projectUri,
                userName:$userName,
                role : $role
            ){
                projectUri
                label
                userRoleInProject
                userRoleInEnvironment
            }
        }`
    }
}


export default addProjectContributor;
