import { gql } from "apollo-boost";

const deleteRedshiftCluster=(clusterUri)=>{
    return {
        variables:{
            clusterUri : clusterUri
        },
        mutation :gql`mutation deleteRedshiftCluster(
            $clusterUri : String!
        ){
            deleteRedshiftCluster(clusterUri:$clusterUri)
        }`
    }
}


export default deleteRedshiftCluster;
