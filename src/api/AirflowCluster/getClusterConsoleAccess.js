import { gql } from "apollo-boost";

const getClusterConsoleAccess=(clusterUri)=>{
    return {
        variables:{
            clusterUri:clusterUri
        },
        query:gql`
            query getAirflowClusterConsoleAccess($clusterUri:String!){
                getAirflowClusterConsoleAccess(clusterUri:$clusterUri)
            }
        `
    }
}


export default getClusterConsoleAccess ;
