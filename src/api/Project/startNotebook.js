import { gql } from 'apollo-boost';

const startNotebook = (notebookUri) => ({
    variables: {
        notebookUri
    },
    mutation: gql`mutation StartNotebook(
            $notebookUri : String!
        ){
            startProjectNotebook(notebookUri:$notebookUri)
        }`
});


export default startNotebook;
