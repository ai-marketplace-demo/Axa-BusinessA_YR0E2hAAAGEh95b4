import { gql } from 'apollo-boost';


const getOrganization = (organizationUri) => ({
    variables: { organizationUri },
    query: gql`
            query GetOrganization($organizationUri:String!){
                getOrganization(organizationUri:$organizationUri){
                    organizationUri
                    label
                    tags
                    SamlGroupName
                    owner
                    description
                    userRoleInOrganization
                }
            }`
});


export default getOrganization;
