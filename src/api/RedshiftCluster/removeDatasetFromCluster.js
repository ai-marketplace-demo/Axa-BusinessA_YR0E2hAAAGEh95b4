import { gql } from "apollo-boost";

const removeDatasetFromCluster=({ clusterUri, datasetUri})=>{
    return {
        variables:{clusterUri,datasetUri},
        mutation :gql`mutation removeDatasetFromRedshiftCluster(
            $clusterUri:String,
            $datasetUri:String,
        ){
            removeDatasetFromRedshiftCluster(
                clusterUri:$clusterUri,
                datasetUri:$datasetUri
            )
        }`
    }
}


export default removeDatasetFromCluster;
