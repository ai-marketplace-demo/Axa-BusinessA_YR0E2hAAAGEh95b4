import { gql } from 'apollo-boost';

const deleteProjectPipeline = (pipelineUri) => ({
    variables: {
        pipelineUri
    },
    mutation: gql`mutation DeleteProjectPipeline(
            $pipelineUri : String!
        ){
            deleteProjectPipeline(pipelineUri:$pipelineUri)
        }`
});


export default deleteProjectPipeline;
