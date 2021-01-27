import { gql } from "apollo-boost";

const archiveDataset=(datasetUri)=>{
    return {
        variables:{
            datasetUri:datasetUri
        },
        mutation :gql`mutation archiveDataset($datasetUri:String!){
            archiveDataset(datasetUri:$datasetUri)
        }`
    }
}


export default archiveDataset;
