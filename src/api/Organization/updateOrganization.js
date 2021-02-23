import { gql } from 'apollo-boost';

const updateOrganization = ({
    organizationUri, label, tags, SamlGroupName, description
}) => ({
    variables: {
        organizationUri,
        input: {
            label, SamlGroupName, tags: tags || [], description: description || ''
        }
    },
    mutation: gql`mutation UpdateOrg($organizationUri:String,$input:ModifyOrganizationInput){
            updateOrganization(organizationUri:$organizationUri,input:$input){
                organizationUri
                label
                created
            }
        }`
});


export default updateOrganization;
