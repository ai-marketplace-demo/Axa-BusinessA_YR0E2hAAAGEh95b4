import { gql } from "apollo-boost";

const deleteDatasetTable= ({tableUri})=>{
    return {
        variables:{
            tableUri:tableUri,
        },
        mutation:gql`
            mutation deleteDatasetTable($tableUri:String!){
                deleteDatasetTable(tableUri:$tableUri)
            }
        `
    }
}

export default deleteDatasetTable ;
