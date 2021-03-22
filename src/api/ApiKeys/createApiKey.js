import { gql } from "apollo-boost";

const createApiKey= ()=>{
    return {
        mutation:gql`
            mutation CreateApiKey{
                createApiKey{
                    ApiKeyId
                    ApiKeySecret
                    expires
                }
            }
        `
    }
}


export default createApiKey ;
