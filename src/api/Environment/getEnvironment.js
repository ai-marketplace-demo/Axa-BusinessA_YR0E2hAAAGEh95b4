import { gql } from 'apollo-boost';

const getEnvironment = ({ environmentUri }) => ({
    variables: {
        environmentUri
    },
    query: gql`
            query GetEnvironment($environmentUri:String){
                getEnvironment(environmentUri:$environmentUri){
                    environmentUri
                    userRoleInEnvironment
                    name
                    label
                    AwsAccountId
                    quicksight_enabled
                    region
                    owner
                    SamlGroupName
                    organization{
                        organizationUri
                        label
                        name
                        userRoleInOrganization
                    }
                    stack{
                            status
                        }
                }
            }
        `
});


export default getEnvironment;
