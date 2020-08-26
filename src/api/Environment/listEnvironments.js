import { gql } from "apollo-boost";

const listEnvironments = ({filter})=>{
    return {
        variables:{
            filter: filter
        },
        query:gql`
            query ListEnvironments($filter:EnvironmentFilter){
                listEnvironments(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        environmentUri
                        userRoleInEnvironment
                        name
                        label
                        AwsAccountId
                        region
                        owner
                        SamlGroupName
                        EnvironmentDefaultIAMRoleName
                        organization{
                            organizationUri
                        }
                    }

                    
                }
            }
        `
    }
}


export default listEnvironments ;
