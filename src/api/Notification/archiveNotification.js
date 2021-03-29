import { gql } from "apollo-boost";

const archiveNotification=({notificationUri})=>{
    return {
        variables:{
            notificationUri
        },
        mutation :gql`mutation deleteNotification($notificationUri:String!){
            deleteNotification(notificationUri:$notificationUri)
        }`
    }
}


export default archiveNotification;
