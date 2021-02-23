import { gql } from 'apollo-boost';

const getPipeline = ({ pipelineUri, filter }) => ({
    variables: {
        pipelineUri,
        filter
    },
    query: gql`query GetPipeline(
            $filter:ProjectPipelineExecutionFilter,
            $pipelineUri: String!
        ){
            getPipeline(pipelineUri:$pipelineUri){
                logs(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        executionUri
                        owner
                        executionArn
                        status
                        created
                        updated
                    }                    
                }

            }
        }`
});


export default getPipeline;
