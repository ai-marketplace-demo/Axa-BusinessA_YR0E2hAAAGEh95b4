import { gql } from "apollo-boost";

const updateDatasetStack=(datasetUri)=>{
    return {
        variables:{datasetUri:datasetUri},
        mutation :gql`mutation updateDatasetStack(
            $datasetUri:String!
        ){
            updateDatasetStack(
                datasetUri:$datasetUri
            )
        }`
    }
}


export default updateDatasetStack;
