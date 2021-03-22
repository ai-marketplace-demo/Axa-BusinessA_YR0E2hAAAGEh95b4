import { gql } from "apollo-boost";

const submitApproval=({shareUri})=>{
    return {
        variables:{
            shareUri:shareUri,
        },
        mutation :gql`mutation submitShareObject($shareUri:String!){
            submitShareObject(shareUri:$shareUri){
                shareUri
                status
            }
        }`
    }
}


export default submitApproval;
