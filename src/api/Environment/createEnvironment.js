import { gql } from 'apollo-boost';

const createEnvironment = ({
    organizationUri, AwsAccountId, region, SamlGroupName, description, label
}) => ({
    variables: {
        input: {
            organizationUri,
            description,
            SamlGroupName,
            label,
            AwsAccountId,
            region
        }
    },
    mutation: gql`mutation CreateEnvironment($input:NewEnvironmentInput){
            createEnvironment(input:$input){
                environmentUri
                label
                userRoleInEnvironment
                SamlGroupName
                AwsAccountId
                created
            }
        }`
});


export default createEnvironment;
