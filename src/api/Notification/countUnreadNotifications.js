import { gql } from "apollo-boost";

const countUnreadNotifications= ()=>{
    return {
        variables:{},
        query:gql`
            query countUnreadNotifications{
                countUnreadNotifications
            }
        `
    }
}


export default countUnreadNotifications;
