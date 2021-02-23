import { gql } from 'apollo-boost';

const getEnvironmentAssumeRoleUrl = ({ environmentUri }) => ({
    variables: {
        environmentUri
    },
    query: gql`
            query GetEnvironmentAssumeRoleUrl($environmentUri:String){
                getEnvironmentAssumeRoleUrl(environmentUri:$environmentUri)
            }
        `
});


export default getEnvironmentAssumeRoleUrl;
