import { gql } from 'apollo-boost';

const listOrganizationGroups = ({
    term, limit, skip, role, organizationUri
}) => ({
    variables: {
        organizationUri,
        filter: { term: term || '' }
    },
    query: gql`
            query getOrg($organizationUri:String,$filter:GroupFilter){
                getOrganization(organizationUri:$organizationUri){
                    groups(filter:$filter){
                        count
                        nodes{
                            groupUri
                            label
                            created
                            groupRoleInOrganization
                            userRoleInGroup
                        }
                    }

                }
            }
        `
});


export default listOrganizationGroups;
