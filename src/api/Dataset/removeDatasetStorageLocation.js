import { gql } from "apollo-boost";

const deleteDatasetStorageLocation=({locationUri})=>{
    return {
        variables:{locationUri},
        mutation :gql`mutation DeleteDatasetStorageLocation(
            $locationUri:String
        ){
            deleteDatasetStorageLocation(
                locationUri:$locationUri
            )
        }`
    }
}


export default deleteDatasetStorageLocation;
