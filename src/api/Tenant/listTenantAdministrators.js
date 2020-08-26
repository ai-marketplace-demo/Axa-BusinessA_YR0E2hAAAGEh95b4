import { gql } from "apollo-boost";

const listTenantAdministrators= (filter)=>{
    return {
        variables:{
            filter:filter
        },
        query:gql`
            query ListTenantAdministrators($filter:TenantAdministratorFilter){
                listTenantAdministrators(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        userRoleInTenant
                        userName
                    }
                    
                }
            }
        `
    }
}


export default listTenantAdministrators ;
