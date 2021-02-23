import { gql } from 'apollo-boost';

const listProjectContributors = (projectUri) => ({
    variables: {
        projectUri
    },
    query: gql`
            query GetProject($projectUri:String!){
                getProject(projectUri:$projectUri){
                        projectUri
                        contributors{
                            count
                            nodes{
                                userName
                                userRoleInProject
                                userRoleInEnvironment
                                created
                            }
                        }
           
                    }
                }
        `
});


export default listProjectContributors;
