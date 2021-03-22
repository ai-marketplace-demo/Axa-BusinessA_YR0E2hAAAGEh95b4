import { gql } from "apollo-boost";

const createEnvironment=(input)=>{
    return {
        variables:{
            input  : input
        },
        mutation :gql`mutation CreateEnvironment($input:NewEnvironmentInput){
            createEnvironment(input:$input){
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


export default createEnvironment;
