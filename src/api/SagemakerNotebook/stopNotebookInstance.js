import { gql } from "apollo-boost";

const stopSagemakerNotebook = (notebookUri)=>{
    return {
        variables:{
            notebookUri:notebookUri,
        },
        mutation:gql`
            mutation StopSagemakerNotebook($notebookUri:String!){
                stopSagemakerNotebook(notebookUri:$notebookUri)
            }
        `
    }
}


export default stopSagemakerNotebook ;
