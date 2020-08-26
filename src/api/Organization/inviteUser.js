import { gql } from "apollo-boost";

const inviteUser=({organizationUri, userName, role})=>{
    return {
        variables:{
            input  : {organizationUri:organizationUri, userName:userName, role:role||'Member'}
        },
        mutation :gql`mutation InviteUser($input:NewOrganizationUserInput){
            inviteUser(input:$input){
                userName
                userRoleInOrganization
                created
            }
        }`
    }
}


export default inviteUser
