import { gql } from "apollo-boost";

const approveTermAssociation=(linkUri)=>{
    return {
        variables:{
            linkUri  : linkUri
        },
        mutation :gql`mutation ApproveTermAssociation($linkUri:String!){
            approveTermAssociation(linkUri:$linkUri)
        }`
    }
}


export default approveTermAssociation;
