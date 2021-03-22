import { gql } from "apollo-boost";

const deployScheduledQuery = (scheduledQueryUri)=>{
    return {
        variables:{
            scheduledQueryUri:scheduledQueryUri
        },
        mutation:gql`
            mutation DeployScheduledQuery (
                $scheduledQueryUri:String!){
                deployScheduledQuery (
                    scheduledQueryUri:$scheduledQueryUri 
                )
            }
        `
    }
}


export default deployScheduledQuery ;
