import { gql } from "apollo-boost";

const approveShareObject=({shareUri})=>{
    return {
        variables:{
            shareUri:shareUri,
        },
        mutation :gql`mutation approveShareObject($shareUri:String!){
            approveShareObject(shareUri:$shareUri){
                shareUri
                status
            }
        }`
    }
}


export default approveShareObject;
