import { gql } from "apollo-boost";

const getClusterConsoleAccess=(clusterUri)=>{
    return {
        variables:{
            clusterUri:clusterUri
        },
        query:gql`
            query getRedshiftClusterConsoleAccess($clusterUri:String!){
                getRedshiftClusterConsoleAccess(clusterUri:$clusterUri)
            }
        `
    }
}


export default getClusterConsoleAccess ;
