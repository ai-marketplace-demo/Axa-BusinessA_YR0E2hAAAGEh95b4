import { gql } from "apollo-boost";

const startSagemakerNotebook = (notebookUri)=>{
    return {
        variables:{
            notebookUri:notebookUri,
        },
        mutation:gql`
            mutation StartSagemakerNotebook($notebookUri:String!){
                startSagemakerNotebook(notebookUri:$notebookUri)
            }
        `
    }
}


export default startSagemakerNotebook ;
