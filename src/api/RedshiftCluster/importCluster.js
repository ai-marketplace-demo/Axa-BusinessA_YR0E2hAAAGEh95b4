import { gql } from "apollo-boost";

const importRedshiftCluster=({environmentUri ,input})=>{
    return {
        variables:{
            environmentUri: environmentUri,
            clusterInput  : input
        },
        mutation :gql`mutation importRedshiftCluster(
            $environmentUri: String!, $clusterInput: ImportClusterInput!
        ){
            importRedshiftCluster(environmentUri:$environmentUri, clusterInput:$clusterInput){
                clusterUri
                name
                label
                created
            }
        }`
    }
}

export default importRedshiftCluster;
