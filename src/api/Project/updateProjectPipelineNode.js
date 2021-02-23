import { gql } from 'apollo-boost';

const updateProjectPipelineNode = ({ nodeUri, input }) => ({
    variables: {
        nodeUri, input
    },
    mutation: gql`mutation UpdateProjectPipelineNode(
            $input:UpdateProjectPipelineNodeInput,
            $nodeUri : String!
        ){
            updateProjectPipelineNode(nodeUri:$nodeUri,input:$input){
                nodeUri
                nodeType
                label
                ordering
                content
                name
            }
        }`
});


export default updateProjectPipelineNode;
