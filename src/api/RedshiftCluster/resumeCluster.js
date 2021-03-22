import { gql } from "apollo-boost";

const resumeRedshiftCluster=(clusterUri)=>{
    return {
        variables:{
            clusterUri : clusterUri
        },
        mutation :gql`mutation resumeRedshiftCluster(
            $clusterUri : String!
        ){
            resumeRedshiftCluster(clusterUri:$clusterUri)
        }`
    }
}


export default resumeRedshiftCluster;
