import { gql } from "apollo-boost";

const getEnvironment = ({environmentUri})=>{
    return {
        variables:{
            environmentUri: environmentUri
        },
        query:gql`
            query GetEnvironment($environmentUri:String){
                getEnvironment(environmentUri:$environmentUri){
                    environmentUri
                    userRoleInEnvironment
                    name
                    label
                    AwsAccountId
                    region
                    owner
                    SamlGroupName
                    organization{
                        organizationUri
                        label
                        name
                        userRoleInOrganization
                    }
                }
            }
        `
    }
}


export default getEnvironment ;
