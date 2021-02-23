import { gql } from 'apollo-boost';

const getProjectNotebookAuthorizedUrl = (notebookUri) => ({
    variables: {
        notebookUri
    },
    query: gql`
            query GetProjectNotebookAuthorizedUrl($notebookUri:String!){
                getProjectNotebookAuthorizedUrl(notebookUri:$notebookUri)
            }
        `
});


export default getProjectNotebookAuthorizedUrl;
