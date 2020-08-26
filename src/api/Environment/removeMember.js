import { gql } from "apollo-boost";

const removeUserFromEnvironment=({environmentUri, userName})=>{
    return {
        variables:{environmentUri:environmentUri, userName:userName},
        mutation :gql`mutation RemoveUserFromEnvironment($environmentUri:String!,$userName:String!){
            removeUserFromEnvironment(
                environmentUri:$environmentUri,
                userName:$userName
            )
        }`
    }
}


export default removeUserFromEnvironment
