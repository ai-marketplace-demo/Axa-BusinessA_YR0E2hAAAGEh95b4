import { gql } from "apollo-boost";

const getTrustAccount = ()=>{
    return {
        query:gql`
            query GetTrustAccount{
                getTrustAccount
            }
        `
    }
}


export default getTrustAccount;
