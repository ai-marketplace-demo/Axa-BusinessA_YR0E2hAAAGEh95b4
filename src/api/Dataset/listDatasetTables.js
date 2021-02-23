import { gql } from 'apollo-boost';

const listDatasetTables = ({ datasetUri, filter }) => ({
    variables: {
        datasetUri,
        filter
    },
    query: gql`
            query GetDataset($datasetUri:String!,$filter:DatasetTableFilter){
                getDataset(datasetUri:$datasetUri){
                        datasetUri
                        tables(filter:$filter){
                            count
                            page
                            pages
                            hasNext
                            hasPrevious
                            nodes{
                                dataset{
                                    datasetUri
                                }
                                tableUri
                                created
                                GlueTableName
                                GlueDatabaseName
                                description
                                stage
                                userRoleForTable
                            }
                        }
           
                    }
                }
        `
});


export default listDatasetTables;
