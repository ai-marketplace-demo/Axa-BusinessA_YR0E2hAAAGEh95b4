import { gql } from "apollo-boost";

const deleteApiKey= (ApiKeyId)=>{
    return {
        variables:{
            ApiKeyId:ApiKeyId
        },
        mutation:gql`
            mutation DeleteApiKey($ApiKeyId:String!){
                deleteApiKey(ApiKeyId:$ApiKeyId)
            }
        `
    }
}


export default deleteApiKey ;
