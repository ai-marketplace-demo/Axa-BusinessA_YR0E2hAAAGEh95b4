import { gql } from "apollo-boost";

const importDataset=(input)=>{
    return {
        variables:{
            input  : input
        },
        mutation :gql`mutation ImportDataset($input:ImportDatasetInput){
            importDataset(input:$input){
                datasetUri
                label
                userRoleForDataset
            }
        }`
    }
}


export default importDataset;
