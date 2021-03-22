import { gql } from "apollo-boost";

const updateMemberRole=({groupUri, userName, role})=>{
    return {
        variables:{
            input  : {groupUri:groupUri, userName:userName, role:role||'Member'}
        },
        mutation :gql`mutation UpdateGroupMember($input:UpdateGroupMemberInput){
            updateGroupMember(input:$input){
                groupUri
            }
        }`
    }
}


export default updateMemberRole;
