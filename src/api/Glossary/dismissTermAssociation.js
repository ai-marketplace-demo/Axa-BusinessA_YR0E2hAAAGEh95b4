import { gql } from "apollo-boost";

const dismissTermAssociation=(linkUri)=>{
    return {
        variables:{
            linkUri  : linkUri
        },
        mutation :gql`mutation DismissTermAssociation($linkUri:String!){
            dismissTermAssociation(linkUri:$linkUri)
        }`
    }
}


export default dismissTermAssociation;
