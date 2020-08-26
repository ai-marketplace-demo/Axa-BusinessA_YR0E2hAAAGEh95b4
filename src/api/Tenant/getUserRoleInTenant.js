import { gql } from "apollo-boost";

const getUserRoleInTenant= ()=>{
    return {
        query:gql`
            query GetUserRoleInTenant{
                getUserRoleInTenant
            }
        `
    }
}


export default getUserRoleInTenant ;
