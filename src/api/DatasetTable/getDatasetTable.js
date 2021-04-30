import { gql } from "apollo-boost";

const getDatasetTable= (tableUri)=>{
    return {
        variables:{
            tableUri:tableUri
        },
        query:gql`
            query GetDatasetTable($tableUri:String!){
                getDatasetTable(tableUri:$tableUri){
                        dataset{
                            datasetUri
                            name
                            userRoleForDataset
                            environment{
                                subscriptionsEnabled
                                subscriptionsProducersTopicImported
                                subscriptionsConsumersTopicImported
                                subscriptionsConsumersTopicName
                                subscriptionsProducersTopicName
                            }
                        }
                        datasetUri
                        owner
                        description
                        created
                        tags
                        tableUri
                        AwsAccountId
                        GlueTableName
                        GlueDatabaseName
                        label
                        name
                        S3Prefix
                        terms{
                            count
                            nodes{
                                nodeUri
                                path
                                label
                            }
                        }
                    }
                }
        `
    }
}


export default getDatasetTable ;
