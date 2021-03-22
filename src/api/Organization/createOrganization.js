import { gql } from "apollo-boost";

const createOrganization=(input)=>{
    return {
        variables:{
            input  :input
        },
        mutation :gql`mutation CreateOrg($input:NewOrganizationInput){
            createOrganization(input:$input){
                organizationUri
                label
                created
            }
        }`
    }
}


export default createOrganization
