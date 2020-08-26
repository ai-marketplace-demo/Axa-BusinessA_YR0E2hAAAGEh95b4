import { gql } from "apollo-boost";


const getOrganization= (organizationUri)=>{
    return {
        variables:{organizationUri:organizationUri},
        query:gql`
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
    }
}


export default getOrganization;
