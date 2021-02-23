import { gql } from 'apollo-boost';

const deleteProjectMLPipeline = (mlPipelineUri) => ({
    variables: {
        mlPipelineUri
    },
    mutation: gql`mutation DeleteProjectMLPipeline(
            $mlPipelineUri : String!
        ){
            deleteProjectMLPipeline(mlPipelineUri:$mlPipelineUri)
        }`
});


export default deleteProjectMLPipeline;
