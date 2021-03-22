import { gql } from "apollo-boost";

const deleteAirflowCluster=(clusterUri)=>{
    return {
        variables:{
            clusterUri : clusterUri
        },
        mutation :gql`mutation deleteAirflowCluster(
            $clusterUri : String!
        ){
            deleteAirflowCluster(clusterUri:$clusterUri)
        }`
    }
};


export default deleteAirflowCluster;
