import { gql } from 'apollo-boost';

const getDatasetQualityJobRun = (datasetUri) => ({
    variables: {
        datasetUri
    },
    query: gql`
            query getDatasetQualityJobRun($datasetUri:String!){
                getDatasetQualityJobRun(datasetUri:$datasetUri){
                    status
                    job_name
                    error
                    run_id
                }
            }
        `
});


export default getDatasetQualityJobRun;
