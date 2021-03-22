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
