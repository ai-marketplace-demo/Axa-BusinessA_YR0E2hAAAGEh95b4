import { gql } from "apollo-boost";

const removeSharedItem=({shareItemUri})=>{
    return {
        variables:{
            shareItemUri:shareItemUri
        },
        mutation :gql`mutation RemoveSharedItem($shareItemUri:String!){
            removeSharedItem(shareItemUri:$shareItemUri)
        }`
    }
}


export default removeSharedItem;
