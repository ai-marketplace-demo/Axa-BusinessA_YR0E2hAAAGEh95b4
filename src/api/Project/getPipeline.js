import { gql } from 'apollo-boost';

const getPipeline = ({ pipelineUri, filter }) => ({
    variables: {
        pipelineUri,
        filter
    },
    query: gql`query GetPipeline(
            $filter:ProjectPipelineNodeFilter,
            $pipelineUri: String!
        ){
            getPipeline(pipelineUri:$pipelineUri){
                nodes(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        nodeUri
                        nodeType
                        ordering
                        label
                        content
                        count
                        name
                        created
                        updated
                    }                    
                }

            }
        }`
});


export default getPipeline;
