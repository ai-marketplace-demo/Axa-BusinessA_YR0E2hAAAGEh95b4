import { gql } from "apollo-boost";

const deleteSagemakerStudioUserProfile = (sagemakerStudioUserProfileUri)=>{
    return {
        variables:{
            sagemakerStudioUserProfileUri:sagemakerStudioUserProfileUri,
        },
        mutation:gql`
            mutation deleteSagemakerStudioUserProfile($sagemakerStudioUserProfileUri:String!){
                deleteSagemakerStudioUserProfile(sagemakerStudioUserProfileUri:$sagemakerStudioUserProfileUri)
            }
        `
    }
}


export default deleteSagemakerStudioUserProfile ;
