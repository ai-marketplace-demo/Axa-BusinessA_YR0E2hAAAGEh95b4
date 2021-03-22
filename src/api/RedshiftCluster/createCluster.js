import { gql } from "apollo-boost";

const createRedshiftCluster=({environmentUri ,input})=>{
    return {
        variables:{
            environmentUri: environmentUri,
            clusterInput  : input
        },
        mutation :gql`mutation createRedshiftCluster(
            $environmentUri: String!, $clusterInput: NewClusterInput!
        ){
            createRedshiftCluster(environmentUri:$environmentUri, clusterInput:$clusterInput){
                clusterUri
                name
                label
                created
            }
        }`
    }
}

export default createRedshiftCluster;
