import { gql } from 'apollo-boost';

const crawlDataset = (datasetUri) => ({
    variables: {
        datasetUri
    },
    mutation: gql`mutation crawlDataset($datasetUri:String!){
            crawlDataset(datasetUri:$datasetUri)
        }`
});


export default crawlDataset;
