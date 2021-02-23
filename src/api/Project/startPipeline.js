import { gql } from 'apollo-boost';

const startPipelineExecution = (pipelineUri) => ({
    variables: {
        pipelineUri
    },
    mutation: gql`mutation StartPipeline(
            $pipelineUri : String!
        ){
            startPipeline(pipelineUri:$pipelineUri)
        }`
});


export default startPipelineExecution;
