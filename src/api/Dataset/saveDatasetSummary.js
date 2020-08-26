import { gql } from "apollo-boost";

const saveDatasetSummary=({datasetUri, content})=>{
    return {
        variables:{
            datasetUri:datasetUri,
            content : content
        },
        mutation :gql`mutation SaveDatasetSummary($datasetUri:String!,$content:String){
            saveDatasetSummary(datasetUri:$datasetUri,content:$content)
        }`
    }
}


export default saveDatasetSummary;
