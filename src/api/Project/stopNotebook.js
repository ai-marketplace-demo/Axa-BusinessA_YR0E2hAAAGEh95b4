import { gql } from 'apollo-boost';

const stopNotebook = (notebookUri) => ({
    variables: {
        notebookUri
    },
    mutation: gql`mutation StartNotebook(
            $notebookUri : String!
        ){
            stopProjectNotebook(notebookUri:$notebookUri)
        }`
});


export default stopNotebook;
