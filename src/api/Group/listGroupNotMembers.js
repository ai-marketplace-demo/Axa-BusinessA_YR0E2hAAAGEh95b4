import { gql } from 'apollo-boost';

const listGroupNotMembers = ({ term, groupUri }) => ({
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
                    notMembers(filter:$filter){
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


export default listGroupNotMembers;
