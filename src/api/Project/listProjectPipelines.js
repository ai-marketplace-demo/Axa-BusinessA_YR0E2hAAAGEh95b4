import { gql } from 'apollo-boost';

const listProjectPipelines = (projectUri) => ({
    variables: {
        projectUri
    },
    query: gql`
            query ListProjectPipelines($projectUri:String!){
                listProjectPipelines(projectUri:$projectUri){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        pipelineUri
                        label
                        created
                        updated
                        description
                    }
                }
            }
        `
});


export default listProjectPipelines;
