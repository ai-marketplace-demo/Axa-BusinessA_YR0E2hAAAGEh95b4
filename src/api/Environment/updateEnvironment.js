import { gql } from "apollo-boost";

const updateEnvironment=({environmentUri,input})=>{
    return {
        variables:{
            environmentUri:environmentUri,
            input  : input
        },
        mutation :gql`mutation UpdateEnvironment($environmentUri:String!,$input:ModifyEnvironmentInput){
            updateEnvironment(environmentUri:$environmentUri,input:$input){
                environmentUri
                label
                userRoleInEnvironment
                SamlGroupName
                AwsAccountId
                created
            }
        }`
    }
}


export default updateEnvironment;
