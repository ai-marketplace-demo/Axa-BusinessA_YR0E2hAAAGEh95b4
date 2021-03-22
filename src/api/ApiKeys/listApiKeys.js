import { gql } from "apollo-boost";

const listApiKeys= ()=>{
    return {
        query:gql`
            query ListApiKeys{
                listApiKeys{
                    count
                    nodes{
                        ApiKeyId
                        expires
                    }
                }
            }
        `
    }
}


export default listApiKeys ;
