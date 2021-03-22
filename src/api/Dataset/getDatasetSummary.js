import { gql } from "apollo-boost";

const getDatasetSummary= (datasetUri)=>{
    return {
        variables:{
            datasetUri:datasetUri
        },
        query:gql`
            query GetDatasetSummary($datasetUri:String!){
                getDatasetSummary(datasetUri:$datasetUri)
            }
        `
    }
}


export default getDatasetSummary ;
