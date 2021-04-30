import { gql } from "apollo-boost";

const publishDatasetUpdate=({datasetUri, s3Prefix})=>{
    return {
        variables:{
            datasetUri:datasetUri,
            s3Prefix  : s3Prefix
        },
        mutation :gql`mutation publishDatasetUpdate($datasetUri:String!,$s3Prefix:String!){
            publishDatasetUpdate(datasetUri:$datasetUri,s3Prefix:$s3Prefix)
        }`
    }
}


export default publishDatasetUpdate;
