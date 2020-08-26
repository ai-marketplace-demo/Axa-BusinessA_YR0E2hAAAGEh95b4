import { gql } from "apollo-boost";

const rejectShareObject=({shareUri})=>{
    return {
        variables:{
            shareUri:shareUri,
        },
        mutation :gql`mutation RejectShareObject($shareUri:String!){
            rejectShareObject(shareUri:$shareUri){
                shareUri
                status
            }
        }`
    }
}


export default rejectShareObject;
