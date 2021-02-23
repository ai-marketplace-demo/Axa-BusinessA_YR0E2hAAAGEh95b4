import { gql } from 'apollo-boost';

const getProjectConsoleUrl = (projectUri) => ({
    variables: {
        projectUri
    },
    query: gql`
            query GetProjectConsoleUrl($projectUri:String!){
                getProjectConsoleAccess(projectUri:$projectUri)
            }
        `
});


export default getProjectConsoleUrl;
