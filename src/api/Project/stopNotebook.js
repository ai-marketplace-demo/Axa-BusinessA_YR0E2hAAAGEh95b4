import { gql } from "apollo-boost";

const stopNotebook=(notebookUri)=>{
    return {
        variables:{
            notebookUri : notebookUri
        },
        mutation :gql`mutation StartNotebook(
            $notebookUri : String!
        ){
            stopProjectNotebook(notebookUri:$notebookUri)
        }`
    }
}


export default stopNotebook;
