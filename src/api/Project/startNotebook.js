import { gql } from "apollo-boost";

const startNotebook=(notebookUri)=>{
    return {
        variables:{
            notebookUri : notebookUri
        },
        mutation :gql`mutation StartNotebook(
            $notebookUri : String!
        ){
            startProjectNotebook(notebookUri:$notebookUri)
        }`
    }
}


export default startNotebook;
