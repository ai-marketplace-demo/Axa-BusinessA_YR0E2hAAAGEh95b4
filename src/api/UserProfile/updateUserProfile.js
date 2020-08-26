import { gql } from "apollo-boost";

const updateUserProfile= (input)=>{
    return {
        variables:{
            input : input
        },
        mutation:gql`mutation UpdateUserProfile($input:UserProfileInput!){
                updateUserProfile(input:$input){
                    username
                    bio
                    b64EncodedAvatar
                    tags
                }
            }
        `
    }
}


export default updateUserProfile ;
