import { gql } from 'apollo-boost';

const getProjectCredentials = (projectUri) => ({
    variables: {
        projectUri
    },
    query: gql`
            query GetProjectCredentials($projectUri:String!){
                getProjectCredentials(projectUri:$projectUri)
            }
        `
});


export default getProjectCredentials;
