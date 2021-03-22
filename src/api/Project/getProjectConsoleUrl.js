import { gql } from "apollo-boost";

const getProjectConsoleUrl= (projectUri)=>{
    return {
        variables:{
            projectUri:projectUri
        },
        query:gql`
            query GetProjectConsoleUrl($projectUri:String!){
                getProjectConsoleAccess(projectUri:$projectUri)
            }
        `
    }
}


export default getProjectConsoleUrl ;
