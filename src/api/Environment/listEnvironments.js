import { gql } from 'apollo-boost';

const listEnvironments = ({ filter }) => ({
    variables: {
        filter
    },
    query: gql`
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
                        created
                        owner
                        SamlGroupName
                        EnvironmentDefaultIAMRoleName
                        stack{
                            status
                        }
                        organization{
                            organizationUri
                            name
                            label
                        }
                    }

                    
                }
            }
        `
});


export default listEnvironments;
