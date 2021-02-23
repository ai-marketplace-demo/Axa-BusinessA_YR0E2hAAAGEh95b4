import { gql } from 'apollo-boost';

const createNotebook = ({ projectUri, input }) => ({
    variables: {
        projectUri,
        input
    },
    mutation: gql`mutation CreateProjectNotebook(
            $input:NewProjectNotebookInput,
            $projectUri : String!
        ){
            createProjectNotebook(projectUri:$projectUri,input:$input){
                notebookUri
                NotebookInstanceName
                NotebookInstanceStatus
                AWSAccountId
                RoleArn
                created
                owner
            }
        }`
});


export default createNotebook;
