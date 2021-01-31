import { gql } from "apollo-boost";

const getNotebook = (notebookUri)=>{
    return {
        variables:{
            notebookUri:notebookUri,
        },
        query:gql`
            query getSagemakerNotebook ($notebookUri:String!){
                getSagemakerNotebook (notebookUri:$notebookUri){
                    notebookUri
                    name
                    owner
                    description
                    label
                    created
                    tags
                    NotebookInstanceStatus
                    userRoleForProjectNotebook
                    environment{
                        label
                        name
                        environmentUri
                        AwsAccountId
                        region
                    }
                    organization{
                        label
                        name
                        organizationUri
                    }
                    stack{
                     status
                    }
                }
            }
        `
    }
}


export default getNotebook ;
