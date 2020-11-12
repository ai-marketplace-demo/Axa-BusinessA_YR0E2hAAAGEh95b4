import { gql } from "apollo-boost";

const getReaderSession= (dashboardUri)=>{
    return {
        variables:{
            dashboardUri:dashboardUri,
        },
        query:gql`
            query GetReaderSession($dashboardUri:String){
                getReaderSession(dashboardUri:$dashboardUri)
            }
        `
    }
}


export default getReaderSession ;
