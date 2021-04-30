import { gql } from "apollo-boost";

const publishDatasetTableUpdate=({tableUri})=>{
    return {
        variables:{
            tableUri:tableUri,
        },
        mutation :gql`mutation publishDatasetTableUpdate($tableUri:String!){
            publishDatasetTableUpdate(tableUri:$tableUri)
        }`
    }
}

export default publishDatasetTableUpdate;
