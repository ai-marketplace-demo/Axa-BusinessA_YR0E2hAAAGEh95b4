import { gql } from "apollo-boost";

const inviteUser=({environmentUri, userName, role})=>{
    return {
        variables:{environmentUri:environmentUri, userName:userName, role:role||'Invited'},
        mutation :gql`mutation InviteUserOnEnvironment($environmentUri:String!,$userName:String!,$role:EnvironmentPermission!){
            inviteUserOnEnvironment(
                environmentUri:$environmentUri,
                role:$role,
                userName:$userName
            ){
                environmentUri
                userRoleInEnvironment
                created
            }
        }`
    }
}


export default inviteUser
