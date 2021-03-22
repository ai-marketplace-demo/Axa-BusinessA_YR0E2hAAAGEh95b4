import { gql } from "apollo-boost";

const getAirflowClusterWebLoginToken=(clusterUri)=>{
    return {
        variables:{
            clusterUri:clusterUri
        },
        query:gql`
            query getAirflowClusterWebLoginToken($clusterUri:String!){
                getAirflowClusterWebLoginToken(clusterUri:$clusterUri)
            }
        `
    }
}


export default getAirflowClusterWebLoginToken ;
