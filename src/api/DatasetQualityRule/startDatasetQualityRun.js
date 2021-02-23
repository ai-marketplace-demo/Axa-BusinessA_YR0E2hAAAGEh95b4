import { gql } from 'apollo-boost';

const startDatasetQualityRun = (datasetUri) => ({
    variables: {
        datasetUri
    },
    mutation: gql`
            mutation StartDatasetQualityRun($datasetUri:String!){
                startDatasetQualityRun(datasetUri:$datasetUri)
            }
        `
});


export default startDatasetQualityRun;
