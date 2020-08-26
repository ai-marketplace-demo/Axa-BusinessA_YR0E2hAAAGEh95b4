import { gql } from "apollo-boost";

const getEnvironmentAssumeRoleUrl = ({environmentUri})=>{
    return {
        variables:{
            environmentUri: environmentUri
        },
        query:gql`
            query GetEnvironmentAssumeRoleUrl($environmentUri:String){
                getEnvironmentAssumeRoleUrl(environmentUri:$environmentUri)
            }
        `
    }
}


export default getEnvironmentAssumeRoleUrl ;
