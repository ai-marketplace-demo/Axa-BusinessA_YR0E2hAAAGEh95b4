import { gql } from "apollo-boost";

const syncTables=(datasetUri)=>{
    return {
        variables:{
            datasetUri: datasetUri
        },
        mutation :gql`mutation SyncTables($datasetUri:String!){
            syncTables(datasetUri:$datasetUri){
                count 
                nodes
                {
                    tableUri
                    GlueTableName
                    GlueDatabaseName
                    description
                    name
                    label
                    dataset{
                        datasetUri
                        name
                        GlueDatabaseName
                        userRoleForDataset
                    }
                }
            }
        }`
    }
}


export default syncTables;
