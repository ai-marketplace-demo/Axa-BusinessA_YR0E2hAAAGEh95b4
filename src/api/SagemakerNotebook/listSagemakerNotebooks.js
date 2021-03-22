import { gql } from "apollo-boost";

const listSagemakerNotebooks= (filter)=>{
    return {
        variables:{
            filter:filter,
        },
        query:gql`
            query ListSagemakerNotebooks($filter:SagemakerNotebookFilter){
                listSagemakerNotebooks(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        notebookUri
                        name
                        owner
                        description
                        label
                        created
                        tags
                        NotebookInstanceStatus
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
                            stack
                            status
                         }
                    }

                }
            }
        `
    }
}


export default listSagemakerNotebooks ;
