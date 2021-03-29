import { gql } from "apollo-boost";

const markNotificationAsRead=({notificationUri})=>{
    return {
        variables:{
            notificationUri
        },
        mutation :gql`mutation markNotificationAsRead($notificationUri:String!){
            markNotificationAsRead(notificationUri:$notificationUri)
        }`
    }
}


export default markNotificationAsRead;
