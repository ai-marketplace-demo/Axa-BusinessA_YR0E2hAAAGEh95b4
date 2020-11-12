import { gql } from "apollo-boost";

const removeSavedQuery=(queryUri)=>{
    return {
        variables:{
            queryUri: queryUri
        },
        mutation :gql`mutation RemoveSavedQuery(
            $queryUri:String!,
        ){
            removeSavedQuery(savedQueryUri:$queryUri)
        }`
    }
}


export default removeSavedQuery;
