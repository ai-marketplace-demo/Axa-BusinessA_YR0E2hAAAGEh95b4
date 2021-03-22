import { gql } from "apollo-boost";

const removeWorksheetShare=(worksheetShareUri)=>{
    return {
        variables:{
            worksheetShareUri:worksheetShareUri,
        },
        mutation :gql`mutation RemoveWorksheetShare(
            $worksheetShareUri:String!,
        ){
            removeWorksheetShare(worksheetShareUri:$worksheetShareUri)
        }`
    }
}


export default removeWorksheetShare;
