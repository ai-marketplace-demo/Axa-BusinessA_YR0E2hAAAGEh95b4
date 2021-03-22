import { gql } from "apollo-boost";

const listWorksheetShares=({worksheetUri, filter})=>{
    return {
        variables:{
            worksheetUri  : worksheetUri,
            filter: filter
        },
        query :gql`query GetWorksheet(
            $worksheetUri:String!,
            $filter:WorksheetFilter
        ){
        getWorksheet(worksheetUri:$worksheetUri){
            shares(filter:$filter){
                count
                page
                pages
                hasNext
                hasPrevious
                nodes{
                    worksheetShareUri
                    principalId
                    principalType                }

            }
            }
        }`
    }
}


export default listWorksheetShares;
