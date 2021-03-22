import { gql } from "apollo-boost";

const createWorksheet=(input)=>{
    return {
        variables:{
            input  : input
        },
        mutation :gql`mutation CreateWorksheet(
            $input:NewWorksheetInput,
        ){
            createWorksheet(input:$input){
                worksheetUri
                label
                created
            }
        }`
    }
}


export default createWorksheet;
