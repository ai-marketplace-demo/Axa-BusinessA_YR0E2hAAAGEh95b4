import { gql } from 'apollo-boost';

const getDatasetTable = (tableUri) => ({
    variables: {
        tableUri
    },
    query: gql`
            query GetDatasetTable($tableUri:String!){
                getDatasetTable(tableUri:$tableUri){
                        dataset{
                            datasetUri
                        }
                        owner
                        created
                        tableUri
                        AwsAccountId
                        GlueTableName
                    }
                }
        `
});


export default getDatasetTable;
