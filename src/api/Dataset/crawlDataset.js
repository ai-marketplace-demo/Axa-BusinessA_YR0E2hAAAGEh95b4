import { gql } from "apollo-boost";

const crawlDataset=(datasetUri)=>{
    return {
        variables:{
            datasetUri: datasetUri
        },
        mutation :gql`mutation crawlDataset($datasetUri:String!){
            crawlDataset(datasetUri:$datasetUri)
        }`
    }
}


export default crawlDataset;
