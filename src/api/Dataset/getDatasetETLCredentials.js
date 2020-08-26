import { gql } from "apollo-boost";

const getDatasetETLCredentials= (datasetUri)=>{
    return {
        variables:{
            datasetUri:datasetUri
        },
        query:gql`
            query GetDatasetETLCredentials($datasetUri:String!){
                getDatasetETLCredentials(datasetUri:$datasetUri)
            }
        `
    }
}


export default getDatasetETLCredentials ;
