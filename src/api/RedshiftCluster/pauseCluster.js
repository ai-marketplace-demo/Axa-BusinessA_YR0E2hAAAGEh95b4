import { gql } from "apollo-boost";

const pauseRedshiftCluster=(clusterUri)=>{
    return {
        variables:{
            clusterUri : clusterUri
        },
        mutation :gql`mutation pauseRedshiftCluster(
            $clusterUri : String!
        ){
            pauseRedshiftCluster(clusterUri:$clusterUri)
        }`
    }
}


export default pauseRedshiftCluster;
