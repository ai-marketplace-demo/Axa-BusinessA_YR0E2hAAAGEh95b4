import { gql } from "apollo-boost";

const createSagemakerStudioUserProfile=(input)=>{
    return {
        variables:{
            input  : input
        },
        mutation :gql`mutation createSagemakerStudioUserProfile(
            $input:NewSagemakerStudioUserProfileInput,
        ){
            createSagemakerStudioUserProfile(input:$input){
                sagemakerStudioUserProfileUri
                name
                label
                created
                description
                tags
            }
        }`
    }
}


export default createSagemakerStudioUserProfile;
