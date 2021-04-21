import { gql } from "apollo-boost";

const getSagemakerStudioUserProfilePresignedUrl = (sagemakerStudioUserProfileUri)=>{
    return {
        variables:{
            sagemakerStudioUserProfileUri:sagemakerStudioUserProfileUri,
        },
        query:gql`
            query getSagemakerStudioUserProfilePresignedUrl ($sagemakerStudioUserProfileUri:String!){
                getSagemakerStudioUserProfilePresignedUrl(sagemakerStudioUserProfileUri:$sagemakerStudioUserProfileUri)
            }
        `
    }
}


export default getSagemakerStudioUserProfilePresignedUrl ;
