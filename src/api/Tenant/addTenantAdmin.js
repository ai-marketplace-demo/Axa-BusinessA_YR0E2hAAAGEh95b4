import { gql } from "apollo-boost";

const addTenantAdministrator= (userName)=>{
    return {
        variables:{
            userName:userName
        },
        mutation:gql`
            mutation AddTenantAdministrator($userName:String!){
                addTenantAdministrator(userName:$userName)
            }
        `
    }
}


export default addTenantAdministrator ;
