import { gql } from "apollo-boost";

const startWorksheetQuery=({worksheetUri,input})=>{
    return {
        variables:{
            worksheetUri:worksheetUri,
            input  : input
        },
        mutation :gql`mutation StartWorksheetQuery(
            $worksheetUri:String!,
            $input:WorksheetQueryInput!,
        ){
            startWorksheetQuery(worksheetUri:$worksheetUri,input:$input){
                AthenaQueryId
                Error
                Status
                DataScannedInBytes
                ElapsedTimeInMs
            }
        }`
    }
}


export default startWorksheetQuery;
