import { gql } from 'apollo-boost';

const updateProject = ({ projectUri, input }) => ({
    variables: {
        projectUri,
        input
    },
    mutation: gql`mutation UpdateProject(
            $input:ModifyProjectInput,
            $projectUri : String!
        ){
            updateProject(projectUri:$projectUri,input:$input){
                projectUri
                label
                description
                tags
                created
                userRoleInProject
            }
        }`
});


export default updateProject;
