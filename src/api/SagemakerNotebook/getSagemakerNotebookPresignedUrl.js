import { gql } from "apollo-boost";

const getSagemakerNotebookPresignedUrl = (notebookUri)=>{
    return {
        variables:{
            notebookUri:notebookUri,
        },
        query:gql`
            query getSagemakerNotebookPresignedUrl ($notebookUri:String!){
                getSagemakerNotebookPresignedUrl(notebookUri:$notebookUri)
            }
        `
    }
}


export default getSagemakerNotebookPresignedUrl ;
