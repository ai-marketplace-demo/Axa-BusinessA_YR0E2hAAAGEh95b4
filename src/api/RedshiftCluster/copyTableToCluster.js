import { gql } from "apollo-boost";

const copyTableToCluster=({ clusterUri, datasetUri, tableUri, schema})=>{
    return {
        variables:{clusterUri,datasetUri, tableUri, schema},
        mutation :gql`mutation enableRedshiftClusterDatasetTableCopy(
            $clusterUri:String!,
            $datasetUri:String!,
            $tableUri:String!,
            $schema: String!
        ){
            enableRedshiftClusterDatasetTableCopy(
                clusterUri:$clusterUri,
                datasetUri:$datasetUri,
                tableUri:$tableUri,
                schema:$schema
            )
        }`
    }
}


export default copyTableToCluster;
