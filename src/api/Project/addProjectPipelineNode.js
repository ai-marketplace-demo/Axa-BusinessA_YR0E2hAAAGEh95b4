import { gql } from 'apollo-boost';

const addProjectPipelineNode = ({ pipelineUri, input }) => ({
    variables: {
        pipelineUri, input
    },
    mutation: gql`mutation addProjectPipelineNode(
            $input:NewProjectPipelineNodeInput,
            $pipelineUri : String!
        ){
            addProjectPipelineNode(pipelineUri:$pipelineUri,input:$input){
                nodeUri
                nodeType
                label
                name
            }
        }`
});


export default addProjectPipelineNode;
