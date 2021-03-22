import { gql } from "apollo-boost";

const listWorksheets=({filter})=>{
    return {
        variables:{
            filter  : filter
        },
        query :gql`query ListWorksheets(
            $filter:WorksheetFilter,
        ){
        listWorksheets(filter:$filter){
                count
                page
                pages
                hasNext
                hasPrevious
                nodes{
                    worksheetUri
                    label
                    description
                    tags
                    owner
                    created
                    userRoleForWorksheet
                }
            }
        }`
    }
}


export default listWorksheets;
