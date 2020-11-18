import { gql } from "apollo-boost";

const rebootRedshiftCluster=(clusterUri)=>{
    return {
        variables:{
            clusterUri : clusterUri
        },
        mutation :gql`mutation rebootRedshiftCluster(
            $clusterUri : String!
        ){
            rebootRedshiftCluster(clusterUri:$clusterUri)
        }`
    }
}


export default rebootRedshiftCluster;
