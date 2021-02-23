import { gql } from 'apollo-boost';

const listDatasetStorageLocations = (datasetUri) => ({
    variables: {
        datasetUri
    },
    query: gql`
            query GetDataset($datasetUri:String!){
                getDataset(datasetUri:$datasetUri){
                        datasetUri
                        locations{
                            count
                            nodes{
                                locationUri
                                created
                                S3Prefix
                                name
                                description
                                created
                                userRoleForStorageLocation
                            }
                        }
           
                    }
                }
        `
});


export default listDatasetStorageLocations;
