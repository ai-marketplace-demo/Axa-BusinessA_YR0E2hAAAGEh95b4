import { gql } from "apollo-boost";

const getAuthorSession= (environmentUri,dashboardUri)=>{
    return {
        variables:{
            environmentUri: environmentUri,
            dashboardUri:dashboardUri,
        },
        query:gql`
            query GetAuthorSession($environmentUri:String,$dashboardUri:String){
                getAuthorSession(environmentUri:$environmentUri,dashboardUri:$dashboardUri)
            }
        `
    }
}


export default getAuthorSession ;
