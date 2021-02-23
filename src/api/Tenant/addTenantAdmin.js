import { gql } from 'apollo-boost';

const addTenantAdministrator = (userName) => ({
    variables: {
        userName
    },
    mutation: gql`
            mutation AddTenantAdministrator($userName:String!){
                addTenantAdministrator(userName:$userName)
            }
        `
});


export default addTenantAdministrator;
