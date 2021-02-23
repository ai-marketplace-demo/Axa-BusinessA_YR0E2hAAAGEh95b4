import { gql } from 'apollo-boost';

const updateProjectContributor = ({ userName, projectUri, role }) => ({
    variables: { userName, projectUri, role },
    mutation: gql`mutation UpdateProjectContributor(
            $projectUri:String,
            $userName:String,
            $role:ProjectMemberRole
        ){
            updateProjectContributor(
                projectUri:$projectUri,
                userName:$userName,
                role : $role
            ){
                projectUri
                label
                userRoleInProject
            }
        }`
});


export default updateProjectContributor;
