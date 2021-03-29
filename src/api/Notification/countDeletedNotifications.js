import { gql } from "apollo-boost";

const countDeletedNotifications= ()=>{
    return {
        variables:{
        },
        query:gql`
            query countDeletedNotifications{
                countDeletedNotifications
            }
        `
    }
}


export default countDeletedNotifications;
