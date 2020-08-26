import { gql } from "apollo-boost";

const createGroup=({organizationUri, description,label, role})=>{
    return {
        variables:{
            input  : {organizationUri:organizationUri, description:description,label:label, role:role||'Member'}
        },
        mutation :gql`mutation CreateGroup($input:NewGroupInput){
            createGroup(input:$input){
                groupUri
                label
                groupRoleInOrganization
                created
                userRoleInGroup
            }
        }`
    }
}


export default createGroup
