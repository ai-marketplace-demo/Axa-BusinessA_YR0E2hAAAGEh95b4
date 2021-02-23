import { gql } from 'apollo-boost';

const updateMemberRole = ({ groupUri, userName, role }) => ({
    variables: {
        input: { groupUri, userName, role: role || 'Member' }
    },
    mutation: gql`mutation UpdateGroupMember($input:UpdateGroupMemberInput){
            updateGroupMember(input:$input){
                groupUri
            }
        }`
});


export default updateMemberRole;
