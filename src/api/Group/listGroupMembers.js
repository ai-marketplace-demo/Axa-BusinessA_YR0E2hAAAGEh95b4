import { gql } from 'apollo-boost';

const listGroupMembers = ({ term, groupUri }) => ({
    variables: {
        groupUri,
        filter: { userName: term || '' }
    },
    query: gql`
            query getGroup($filter:GroupMemberFilter,$groupUri:String){
                getGroup(groupUri:$groupUri){
                    groupUri
                    userRoleInGroup
                    groupRoleInOrganization
                    members(filter:$filter){
                        count
                        nodes{
                            userName
                            userRoleInGroup
                            created
                        }
                    }

                }
            }
        `
});


export default listGroupMembers;
