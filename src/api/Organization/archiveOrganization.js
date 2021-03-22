import { gql } from "apollo-boost";

const archiveOrganization=(organizationUri)=>{
    return {
        variables:{
            organizationUri:organizationUri
        },
        mutation :gql`mutation ArciveOrg($organizationUri:String!){
            archiveOrganization(organizationUri:$organizationUri)
        }`
    }
}


export default archiveOrganization;
