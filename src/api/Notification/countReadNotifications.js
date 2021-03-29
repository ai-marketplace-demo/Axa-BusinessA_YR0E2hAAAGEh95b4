import { gql } from "apollo-boost";

const countReadNotifications= ()=>{
    return {
        variables:{},
        query:gql`
            query countReadNotifications{
                countReadNotifications
            }
        `
    }
}


export default countReadNotifications;
