import { gql } from "apollo-boost";

const listProjectTrustRelationships= ({projectUri,filter})=>{
    return {
        variables:{
            projectUri:projectUri,
            filter:filter
        },
        query:gql`
            query GetProject($filter:ProjectTrustRelationshipFilter,$projectUri:String!){
                getProject(projectUri:$projectUri){
                        projectUri
                        trustRelationships(filter:$filter){
                            count
                            page
                            pageSize
                            hasNext
                            hasPrevious
                            pages
                            nodes{
                                trustUri
                                label
                                IAMPrincipalArn
                                description
                                label
                                tags
                            }
                        }
           
                    }
                }
        `
    }
}


export default listProjectTrustRelationships ;
