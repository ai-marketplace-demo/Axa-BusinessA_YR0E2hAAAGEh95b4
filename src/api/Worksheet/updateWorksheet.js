import { gql } from "apollo-boost";

const updateWorksheet=({worksheetUri,input})=>{
    return {
        variables:{
            worksheetUri:worksheetUri,
            input  : input
        },
        mutation :gql`mutation UpdateWorksheet(
            $worksheetUri:String!,
            $input:UpdateWorksheetInput,
        ){
            updateWorksheet(worksheetUri:$worksheetUri,input:$input){
                worksheetUri
                label
                created
            }
        }`
    }
}


export default updateWorksheet;
