import { gql } from "apollo-boost";

const updateDatasetTable= ({tableUri,input})=>{
    return {
        variables:{
            tableUri:tableUri,
            input:input
        },
        mutation:gql`
            mutation UpdateDatasetTable($tableUri:String!,$input:ModifyDatasetTableInput!){
                updateDatasetTable(tableUri:$tableUri,input:$input){
                    tableUri
                }
            }
        `
    }
}


export default updateDatasetTable ;
