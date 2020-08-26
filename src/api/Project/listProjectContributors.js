import { gql } from "apollo-boost";

const listProjectContributors= (projectUri)=>{
    return {
        variables:{
            projectUri:projectUri
        },
        query:gql`
            query GetProject($projectUri:String!){
                getProject(projectUri:$projectUri){
                        projectUri
                        contributors{
                            count
                            nodes{
                                userName
                                userRoleInProject
                                userRoleInEnvironment
                                created
                            }
                        }
           
                    }
                }
        `
    }
}


export default listProjectContributors ;
