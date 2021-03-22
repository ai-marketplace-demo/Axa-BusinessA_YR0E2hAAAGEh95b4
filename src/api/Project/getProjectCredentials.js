import { gql } from "apollo-boost";

const getProjectCredentials= (projectUri)=>{
    return {
        variables:{
            projectUri:projectUri
        },
        query:gql`
            query GetProjectCredentials($projectUri:String!){
                getProjectCredentials(projectUri:$projectUri)
            }
        `
    }
}


export default getProjectCredentials ;
