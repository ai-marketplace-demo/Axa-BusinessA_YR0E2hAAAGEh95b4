import { gql } from "apollo-boost";

const listNotifications= (filter)=>{
    return {
        variables:{
            filter:filter,
        },
        query:gql`
            query listNotifications($filter:NotificationFilter){
                listNotifications(filter:$filter){
                    count
                    page
                    pages
                    hasNext
                    hasPrevious
                    nodes{
                        notificationUri
                        message
                        type
                        is_read
                    }
                }
            }
        `
    }
}


export default listNotifications ;
