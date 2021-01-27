import { gql } from "apollo-boost";

const deleteDataset=(datasetUri)=>{
    return {
        variables:{
            datasetUri:datasetUri
        },
        mutation :gql`mutation deleteDataset($datasetUri:String!){
            deleteDataset(datasetUri:$datasetUri)
        }`
    }
}


export default deleteDataset;
