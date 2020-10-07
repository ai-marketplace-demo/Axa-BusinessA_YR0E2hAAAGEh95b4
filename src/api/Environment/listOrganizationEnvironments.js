import { gql } from "apollo-boost";

const listOrganizationEnvironments= ({organizationUri, filter})=>{
    return {
        variables:{
            organizationUri: organizationUri,
            filter:filter
        },
        query:gql`
            query getOrg($organizationUri:String,$filter:EnvironmentFilter){
                getOrganization(organizationUri:$organizationUri){
                    environments(filter:$filter){
                        count
                        page
                        pageSize
                        hasNext
                        pages
                        hasPrevious
                        nodes{
                            environmentUri
                            label
                            name
                            owner
                            region
                            EnvironmentDefaultIAMRoleArn
                            EnvironmentDefaultIAMRoleName
                            SamlGroupName
                            created
                            deleted
                            validated
                            roleCreated
                            environmentType
                            AwsAccountId
                            quicksight_enabled
                            userRoleInEnvironment
                            stack{
                                status
                            }
                        }
                    }

                }
            }
        `
    }
}


export default listOrganizationEnvironments;
