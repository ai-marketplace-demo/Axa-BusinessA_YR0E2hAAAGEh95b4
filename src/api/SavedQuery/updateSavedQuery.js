import { gql } from "apollo-boost";

const updateSavedQuery=({queryUri,input})=>{
    return {
        variables:{
            queryUri: queryUri,
            input  : input
        },
        mutation :gql`mutation UpdateSavedQuery(
            $queryUri:String!,
            $input:ModifySavedQueryInput,
        ){
            updateSavedQuery(queryUri:$queryUri,input:$input){
                savedQueryUri
                name
                description
                label
                created
                sqlBody
                tags
            }
        }`
    }
}


export default updateSavedQuery;
