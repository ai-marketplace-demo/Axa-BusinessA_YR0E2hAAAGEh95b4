import { gql } from "apollo-boost";

const generateDatasetAccessToken= (datasetUri)=>{
    return {
        variables:{
            datasetUri:datasetUri
        },
        mutation:gql`
            mutation GenerateDatasetAccessToken($datasetUri:String!){
                generateDatasetAccessToken(datasetUri:$datasetUri)
            }
        `
    }
}


export default generateDatasetAccessToken ;
