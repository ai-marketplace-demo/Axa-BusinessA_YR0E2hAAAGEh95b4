import { gql } from "apollo-boost";

const publishDatasetStorageLocationUpdate=({locationUri})=>{
    return {
        variables:{
            locationUri:locationUri,
        },
        mutation :gql`mutation publishDatasetStorageLocationUpdate($locationUri:String!){
            publishDatasetStorageLocationUpdate(locationUri:$locationUri)
        }`
    }
}

export default publishDatasetStorageLocationUpdate;
