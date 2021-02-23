import { gql } from 'apollo-boost';

const deleteDataset = (datasetUri) => ({
    variables: {
        datasetUri
    },
    mutation: gql`mutation deleteDataset($datasetUri:String!){
            deleteDataset(datasetUri:$datasetUri)
        }`
});


export default deleteDataset;
