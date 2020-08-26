import { gql } from "apollo-boost";

const getDatasetTableProfilingReport=(jobUri)=>{
    return {
        variables:{
            jobUri: jobUri
        },
        query :gql`query getDatasetTableProfilingReport($jobUri:String!){
            getDatasetTableProfilingReport(jobUri:$jobUri)
        }`
    }
}


export default getDatasetTableProfilingReport;
