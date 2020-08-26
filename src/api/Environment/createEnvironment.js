import { gql } from "apollo-boost";

const createEnvironment=({organizationUri, AwsAccountId,region,SamlGroupName,description,label})=>{
    return {
        variables:{
            input  : {
                organizationUri:organizationUri,
                description:description,
                SamlGroupName: SamlGroupName,
                label:label, AwsAccountId:AwsAccountId,
                region : region
            }
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
