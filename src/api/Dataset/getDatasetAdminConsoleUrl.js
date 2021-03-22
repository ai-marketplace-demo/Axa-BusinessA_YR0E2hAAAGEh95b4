import { gql } from "apollo-boost";

const getDatasetAssumeRoleUrl= (datasetUri)=>{
    return {
        variables:{
            datasetUri:datasetUri
        },
        query:gql`
            query GetDatasetAssumeRoleUrl($datasetUri:String!){
                getDatasetAssumeRoleUrl(datasetUri:$datasetUri)
            }
        `
    }
}


export default getDatasetAssumeRoleUrl ;
