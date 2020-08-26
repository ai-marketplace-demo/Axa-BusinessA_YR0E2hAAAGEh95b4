import { gql } from "apollo-boost";

const removeTenantAdministrator= (userName)=>{
    return {
        variables:{
            userName:userName
        },
        mutation:gql`
            mutation RemoveTenantAdministrator($userName:String!){
                removeTenantAdministrator(userName:$userName)
            }
        `
    }
}


export default removeTenantAdministrator ;
